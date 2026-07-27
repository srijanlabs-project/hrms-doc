import { Injectable } from "@nestjs/common";
import { AuthRepository } from "../../auth/auth.repository";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AuthenticationAppError, ForbiddenAppError } from "../../platform/errors/errors";
import type { CreateHealthRecordDto } from "./dto/create-health-record.dto";
import { HealthRecordRepository } from "./health-record.repository";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/**
 * v1 slice of docs/03-module-specifications/22-health-safety-wellness.md.
 * Collapses checkups, vaccinations, and occupational-health reviews
 * (MedicalCheckup|Vaccination|OccupationalHealthReview) into one type-tagged
 * flat record catalog per employee — the same shape as CertificationRecord.
 * An admin can log a record for any employee; an employee can log their own.
 * No expiry sweep is built for nextDueDate — unlike certifications, nothing
 * currently gates staffing eligibility on it, so it stays a plain reminder
 * field on the record.
 */
@Injectable()
export class HealthRecordService {
  constructor(
    private readonly repository: HealthRecordRepository,
    private readonly authRepository: AuthRepository,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
  ) {}

  async create(dto: CreateHealthRecordDto) {
    const { tenantId, userId } = this.requireAuthenticated();
    let employeeId = dto.employeeId;
    if (employeeId) {
      const user = await this.authRepository.findUserById(tenantId, userId);
      if (!user?.roles.some((role) => ADMIN_ROLES.includes(role))) {
        throw new ForbiddenAppError(this.requestContext.correlationId);
      }
    } else {
      const { employee } = await this.currentEmployee.resolve();
      employeeId = employee.id;
    }

    return this.repository.create(tenantId, {
      employeeId,
      type: dto.type,
      recordDate: new Date(dto.recordDate),
      provider: dto.provider,
      notes: dto.notes,
      nextDueDate: dto.nextDueDate ? new Date(dto.nextDueDate) : undefined,
      evidenceFileId: dto.evidenceFileId,
    });
  }

  async listMine() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.repository.findForEmployee(tenantId, employee.id);
  }

  /** org_admin/hr_ops only — see controller's @Roles guard. */
  async listAll() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findAll(tenantId);
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
