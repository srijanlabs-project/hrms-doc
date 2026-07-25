import { Injectable } from "@nestjs/common";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AuthenticationAppError } from "../../platform/errors/errors";
import type { CreateVendorDto } from "./dto/create-vendor.dto";
import { VendorRepository } from "./vendor.repository";

/** org_admin/hr_ops only — see controller's @Roles guard. */
@Injectable()
export class VendorService {
  constructor(
    private readonly repository: VendorRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async create(dto: CreateVendorDto) {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.create(tenantId, dto);
  }

  async listAll() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findAll(tenantId);
  }

  private requireAuthenticated(): { tenantId: string } {
    const { tenantId } = this.requestContext.store ?? {};
    if (!tenantId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId };
  }
}
