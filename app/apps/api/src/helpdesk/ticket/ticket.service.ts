import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { AuthRepository } from "../../auth/auth.repository";
import { NotificationService } from "../../notifications/notification.service";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { PrismaService } from "../../platform/prisma/prisma.service";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, ForbiddenAppError, NotFoundAppError } from "../../platform/errors/errors";
import type { AddCommentDto } from "./dto/add-comment.dto";
import type { AssignTicketDto } from "./dto/assign-ticket.dto";
import type { CloseTicketDto } from "./dto/close-ticket.dto";
import type { CreateTicketDto } from "./dto/create-ticket.dto";
import { TicketRepository } from "./ticket.repository";
import { SlaPolicyRepository } from "../sla/sla-policy.repository";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-HELPDESK-001",
    code: "HELPDESK-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-TICKET",
    details: { currentState },
  });
}

/**
 * v1 slice — see schema.prisma's Ticket comment for the collapsed
 * state-machine and queue-tagging decisions. Service Agent/Queue Manager
 * collapse to org_admin/hr_ops, matching every other module this pass.
 */
@Injectable()
export class TicketService {
  private readonly logger = new Logger(TicketService.name);

  constructor(
    private readonly repository: TicketRepository,
    private readonly slaPolicyRepository: SlaPolicyRepository,
    private readonly authRepository: AuthRepository,
    private readonly notificationService: NotificationService,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateTicketDto) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const priority = dto.priority ?? "Medium";

    const ticket = await this.repository.create(tenantId, {
      employeeId: employee.id,
      queue: dto.queue,
      category: dto.category,
      subject: dto.subject,
      description: dto.description,
      priority,
    });

    const slaPolicy = await this.slaPolicyRepository.find(tenantId, dto.queue, priority);
    if (slaPolicy) {
      const dueAt = new Date(Date.now() + slaPolicy.resolutionHours * 60 * 60 * 1000);
      await this.repository.setDueAt(tenantId, ticket.id, dueAt);
    }

    const admins = await this.authRepository.findUsersWithAnyRole(tenantId, ADMIN_ROLES);
    await Promise.all(
      admins.map((admin) =>
        this.notificationService.notify(tenantId, admin.id, {
          type: "helpdesk.ticket.created",
          title: `New ${dto.queue} ticket`,
          body: `${employee.legalName} raised: ${dto.subject}`,
          linkPath: "/helpdesk",
        }),
      ),
    );

    return this.repository.findById(tenantId, ticket.id);
  }

  async listMine() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.repository.findForEmployee(tenantId, employee.id);
  }

  /** org_admin/hr_ops only. */
  async listAll(queue?: string, status?: string) {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findAll(tenantId, { queue, status });
  }

  async getById(id: string) {
    const { tenantId, userId } = this.requireAuthenticated();
    const ticket = await this.findTicketOrThrow(tenantId, id);
    const isAdmin = await this.isAdminCaller(tenantId, userId);
    if (!isAdmin && ticket.employeeId !== (await this.currentEmployeeIdOrNull(tenantId, userId))) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }

    const comments = await this.repository.findCommentsForTicket(tenantId, id);
    return { ...ticket, comments: isAdmin ? comments : comments.filter((c) => !c.isInternal) };
  }

  async addComment(id: string, dto: AddCommentDto) {
    const { tenantId, userId } = this.requireAuthenticated();
    const ticket = await this.findTicketOrThrow(tenantId, id);
    const isAdmin = await this.isAdminCaller(tenantId, userId);
    const employeeId = await this.currentEmployeeIdOrNull(tenantId, userId);
    if (!isAdmin && ticket.employeeId !== employeeId) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }

    const comment = await this.repository.addComment(tenantId, {
      ticketId: id,
      authorUserId: userId,
      body: dto.body,
      isInternal: isAdmin ? (dto.isInternal ?? false) : false,
    });

    if (!isAdmin) {
      const admins = await this.authRepository.findUsersWithAnyRole(tenantId, ADMIN_ROLES);
      await Promise.all(
        admins.map((admin) =>
          this.notificationService.notify(tenantId, admin.id, {
            type: "helpdesk.ticket.commented",
            title: "New ticket reply",
            body: `New comment on "${ticket.subject}"`,
            linkPath: "/helpdesk",
          }),
        ),
      );
    } else if (!comment.isInternal) {
      const raiserUser = await this.authRepository.findUserByEmployeeId(tenantId, ticket.employeeId);
      if (raiserUser) {
        await this.notificationService.notify(tenantId, raiserUser.id, {
          type: "helpdesk.ticket.commented",
          title: "Update on your ticket",
          body: `New reply on "${ticket.subject}"`,
          linkPath: "/helpdesk",
        });
      }
    }

    return comment;
  }

  /** org_admin/hr_ops only. */
  async assign(id: string, dto: AssignTicketDto) {
    const { tenantId } = this.requireAuthenticated();
    const ticket = await this.findTicketOrThrow(tenantId, id);
    const count = await this.repository.assign(tenantId, id, dto.agentEmployeeId);
    if (count === 0) {
      throw stateConflict("Only an Open ticket can be assigned.", ticket.status);
    }
    return this.repository.findById(tenantId, id);
  }

  /** org_admin/hr_ops only. */
  async startProgress(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const ticket = await this.findTicketOrThrow(tenantId, id);
    const count = await this.repository.startProgress(tenantId, id);
    if (count === 0) {
      throw stateConflict("Only an Assigned ticket can move to In Progress.", ticket.status);
    }
    return this.repository.findById(tenantId, id);
  }

  /** org_admin/hr_ops only. */
  async resolve(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const ticket = await this.findTicketOrThrow(tenantId, id);
    const count = await this.repository.resolve(tenantId, id);
    if (count === 0) {
      throw stateConflict("Only an Assigned or In Progress ticket can be resolved.", ticket.status);
    }

    const raiserUser = await this.authRepository.findUserByEmployeeId(tenantId, ticket.employeeId);
    if (raiserUser) {
      await this.notificationService.notify(tenantId, raiserUser.id, {
        type: "helpdesk.ticket.resolved",
        title: "Your ticket was resolved",
        body: `"${ticket.subject}" has been marked resolved.`,
        linkPath: "/helpdesk",
      });
    }
    return this.repository.findById(tenantId, id);
  }

  /** Raiser or admin. */
  async close(id: string, dto: CloseTicketDto) {
    const { tenantId, userId } = this.requireAuthenticated();
    const ticket = await this.findTicketOrThrow(tenantId, id);
    const isAdmin = await this.isAdminCaller(tenantId, userId);
    const employeeId = await this.currentEmployeeIdOrNull(tenantId, userId);
    if (!isAdmin && ticket.employeeId !== employeeId) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }

    const count = await this.repository.close(tenantId, id, dto.satisfactionRating);
    if (count === 0) {
      throw stateConflict("Only a Resolved ticket can be closed.", ticket.status);
    }
    return this.repository.findById(tenantId, id);
  }

  /** Raiser only. */
  async reopen(id: string) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const ticket = await this.findTicketOrThrow(tenantId, id);
    if (ticket.employeeId !== employee.id) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }

    const count = await this.repository.reopen(tenantId, id);
    if (count === 0) {
      throw stateConflict("Only a Closed ticket can be reopened.", ticket.status);
    }
    return this.repository.findById(tenantId, id);
  }

  /** Cron entry point — every tenant, every night. */
  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async runDailyForAllTenants(): Promise<void> {
    const tenants = await this.prisma.tenant.findMany({ select: { id: true } });
    for (const { id: tenantId } of tenants) {
      await this.sweepEscalations(tenantId);
    }
  }

  /** Ops "run now" trigger — always scoped to the caller's own tenant. */
  async runEscalationSweepNow(): Promise<void> {
    const { tenantId } = this.requireAuthenticated();
    await this.sweepEscalations(tenantId);
  }

  private async sweepEscalations(tenantId: string): Promise<void> {
    const overdue = await this.repository.findOverdueUnescalated(tenantId);
    if (overdue.length === 0) return;

    await this.repository.markEscalated(tenantId, overdue.map((t) => t.id));
    const admins = await this.authRepository.findUsersWithAnyRole(tenantId, ADMIN_ROLES);
    await Promise.all(
      admins.flatMap((admin) =>
        overdue.map((ticket) =>
          this.notificationService.notify(tenantId, admin.id, {
            type: "helpdesk.ticket.escalated",
            title: "Ticket SLA breached",
            body: `"${ticket.subject}" (${ticket.queue}) has passed its SLA due date.`,
            linkPath: "/helpdesk",
          }),
        ),
      ),
    );
    this.logger.log(`Escalated ${overdue.length} overdue ticket(s) for tenant ${tenantId}.`);
  }

  private async findTicketOrThrow(tenantId: string, id: string) {
    const ticket = await this.repository.findById(tenantId, id);
    if (!ticket) {
      throw new NotFoundAppError("OBJ-TICKET", "Ticket not found.");
    }
    return ticket;
  }

  private async isAdminCaller(tenantId: string, userId: string): Promise<boolean> {
    const user = await this.authRepository.findUserById(tenantId, userId);
    return !!user?.roles.some((role) => ADMIN_ROLES.includes(role));
  }

  private async currentEmployeeIdOrNull(tenantId: string, userId: string): Promise<string | null> {
    const user = await this.authRepository.findUserById(tenantId, userId);
    return user?.employeeId ?? null;
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
