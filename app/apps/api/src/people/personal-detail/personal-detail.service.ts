import { Injectable } from "@nestjs/common";
import { AuthRepository } from "../../auth/auth.repository";
import { RequestContextService } from "../../platform/context/request-context.service";
import { ForbiddenAppError, NotFoundAppError } from "../../platform/errors/errors";
import { EmployeeRepository } from "../employee/employee.repository";
import type { CreateEmergencyContactDto } from "./dto/create-emergency-contact.dto";
import type { UpsertPersonalDetailDto } from "./dto/upsert-personal-detail.dto";
import { PersonalDetailRepository } from "./personal-detail.repository";

/**
 * v1 slice of docs/08-submodule-specifications/02-people-management/02-personal-information.md
 * (collapses personal profile + contact/address into one direct-edit record,
 * no approval workflow) and its "family/dependents/nominees/emergency
 * contacts" catalog item, restricted here to emergency contacts only.
 * Readable/editable by the employee themself or an org_admin/hr_ops — same
 * self-or-admin permission shape used throughout this build.
 */
@Injectable()
export class PersonalDetailService {
  constructor(
    private readonly repository: PersonalDetailRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly authRepository: AuthRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async get(employeeId: string) {
    const tenantId = await this.assertSelfOrAdmin(employeeId);
    const [personalDetail, emergencyContacts] = await Promise.all([
      this.repository.findByEmployeeId(tenantId, employeeId),
      this.repository.findEmergencyContacts(tenantId, employeeId),
    ]);
    return { personalDetail, emergencyContacts };
  }

  async upsert(employeeId: string, dto: UpsertPersonalDetailDto) {
    const tenantId = await this.assertSelfOrAdmin(employeeId);
    return this.repository.upsert(tenantId, employeeId, dto);
  }

  async addEmergencyContact(employeeId: string, dto: CreateEmergencyContactDto) {
    const tenantId = await this.assertSelfOrAdmin(employeeId);
    return this.repository.createEmergencyContact(tenantId, employeeId, dto);
  }

  async removeEmergencyContact(employeeId: string, id: string) {
    const tenantId = await this.assertSelfOrAdmin(employeeId);
    const count = await this.repository.deleteEmergencyContact(tenantId, employeeId, id);
    if (count === 0) {
      throw new NotFoundAppError("OBJ-EMERGENCY-CONTACT", "Emergency contact not found.");
    }
  }

  /** Self-or-admin: the employee themself, or org_admin/hr_ops viewing/editing anyone. */
  private async assertSelfOrAdmin(employeeId: string): Promise<string> {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }
    const employee = await this.employeeRepository.findById(tenantId, employeeId);
    if (!employee) {
      throw new NotFoundAppError("OBJ-EMPLOYEE", "Employee not found.");
    }
    const user = await this.authRepository.findUserById(tenantId, userId);
    const isSelf = user?.employeeId === employeeId;
    const isAdmin = !!user?.roles.some((role) => role === "org_admin" || role === "hr_ops");
    if (!isSelf && !isAdmin) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }
    return tenantId;
  }
}
