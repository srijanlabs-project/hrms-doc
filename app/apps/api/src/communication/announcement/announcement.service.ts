import { Injectable } from "@nestjs/common";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, NotFoundAppError } from "../../platform/errors/errors";
import type { CreateAnnouncementDto } from "./dto/create-announcement.dto";
import { AnnouncementRepository } from "./announcement.repository";

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-ANNOUNCEMENT-001",
    code: "ANNOUNCEMENT-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-ANNOUNCEMENT",
    details: { currentState },
  });
}

/**
 * v1 slice — see schema.prisma's Announcement comment for the collapsed
 * news/bulletin-board/campaign decisions. Publishing has no external
 * dispatch step — it just becomes tenant-wide visible.
 */
@Injectable()
export class AnnouncementService {
  constructor(
    private readonly repository: AnnouncementRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  /** org_admin/hr_ops only — see controller's @Roles guard. */
  async create(dto: CreateAnnouncementDto) {
    const { tenantId, userId } = this.requireAuthenticated();
    return this.repository.create(tenantId, {
      title: dto.title,
      body: dto.body,
      category: dto.category ?? "General",
      createdByUserId: userId,
    });
  }

  /** Self-service: every published announcement, newest first. */
  async listPublished() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findPublished(tenantId);
  }

  /** org_admin/hr_ops only. */
  async listAllAdmin() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findAllAdmin(tenantId);
  }

  async publish(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const announcement = await this.findOrThrow(tenantId, id);
    const count = await this.repository.publish(tenantId, id);
    if (count === 0) {
      throw stateConflict("Only a Draft announcement can be published.", announcement.status);
    }
    return this.repository.findById(tenantId, id);
  }

  async archive(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const announcement = await this.findOrThrow(tenantId, id);
    const count = await this.repository.archive(tenantId, id);
    if (count === 0) {
      throw stateConflict("Only a Published announcement can be archived.", announcement.status);
    }
    return this.repository.findById(tenantId, id);
  }

  private async findOrThrow(tenantId: string, id: string) {
    const announcement = await this.repository.findById(tenantId, id);
    if (!announcement) {
      throw new NotFoundAppError("OBJ-ANNOUNCEMENT", "Announcement not found.");
    }
    return announcement;
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
