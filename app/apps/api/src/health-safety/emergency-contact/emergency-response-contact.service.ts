import { Injectable } from "@nestjs/common";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AuthenticationAppError } from "../../platform/errors/errors";
import type { CreateEmergencyResponseContactDto } from "./dto/create-emergency-response-contact.dto";
import { EmergencyResponseContactRepository } from "./emergency-response-contact.repository";

/**
 * v1 slice of docs/03-module-specifications/22-health-safety-wellness.md.
 * See schema.prisma's EmergencyResponseContact comment: a simple admin-
 * managed "who to call" directory (Fire/Medical/Security/Facilities), not an
 * automated alert dispatcher — no SMS/push/PA channel exists in this
 * environment to broadcast to. Distinct from the pre-existing per-employee
 * EmergencyContact (People Management's personal next-of-kin record).
 */
@Injectable()
export class EmergencyResponseContactService {
  constructor(
    private readonly repository: EmergencyResponseContactRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async listActive() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findActive(tenantId);
  }

  /** org_admin/hr_ops only — see controller's @Roles guard. */
  async listAll() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findAll(tenantId);
  }

  /** org_admin/hr_ops only — see controller's @Roles guard. */
  async create(dto: CreateEmergencyResponseContactDto) {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.create(tenantId, {
      name: dto.name,
      role: dto.role,
      phone: dto.phone,
      category: dto.category ?? "Other",
    });
  }

  /** org_admin/hr_ops only — see controller's @Roles guard. */
  async setActive(id: string, isActive: boolean) {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.setActive(tenantId, id, isActive);
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
