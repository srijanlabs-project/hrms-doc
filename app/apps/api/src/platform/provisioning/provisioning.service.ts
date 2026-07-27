import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { AppError } from "../errors/app-error";
import type { ProvisionTenantDto } from "./dto/provision-tenant.dto";

/**
 * W0·E28 Administration — tenant provisioning. The `tenants` table itself
 * carries no RLS policy (it's the platform-plane root, not tenant-scoped
 * data), so creating a Tenant row is a plain create. The first admin User
 * row, though, lives in a tenant_isolation-policed table, so it's created
 * via PrismaService.withTenant(newTenant.id, ...) — note this call doesn't
 * come from any existing request's own tenant context (there isn't one;
 * this runs before the new tenant has any session), it's just handed the
 * brand-new tenant's id directly.
 */
@Injectable()
export class ProvisioningService {
  constructor(private readonly prisma: PrismaService) {}

  async provision(dto: ProvisionTenantDto) {
    const tenant = await this.createTenant(dto.tenantCode, dto.tenantName);

    const admin = await this.prisma.withTenant(tenant.id, (tx) =>
      tx.user.create({
        data: {
          tenantId: tenant.id,
          email: dto.adminEmail,
          roles: ["org_admin"],
        },
      }),
    );

    return {
      tenant: { id: tenant.id, code: tenant.code, name: tenant.name },
      admin: { id: admin.id, email: admin.email, roles: admin.roles },
    };
  }

  private async createTenant(code: string, name: string) {
    try {
      return await this.prisma.tenant.create({ data: { code, name } });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new AppError({
          errorRef: "ERR-PROVISION-001",
          code: "PROVISION-001",
          category: "state-conflict",
          severity: "medium",
          httpStatus: 409,
          message: `A tenant with code "${code}" already exists.`,
          userAction: "Choose a different tenant code.",
          retryable: false,
          tenantSafe: true,
          objectRef: "OBJ-TENANT",
        });
      }
      throw err;
    }
  }
}
