import { Injectable } from "@nestjs/common";
import type { EmployeePayComponent, PayComponent, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type EmployeePayComponentWithComponent = EmployeePayComponent & { payComponent: PayComponent };

const includeComponent = { payComponent: true } satisfies Prisma.EmployeePayComponentInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class PayComponentRepository {
  constructor(private readonly prisma: PrismaService) {}

  createComponent(tenantId: string, data: Omit<Prisma.PayComponentUncheckedCreateInput, "tenantId">): Promise<PayComponent> {
    return this.prisma.withTenant(tenantId, (tx) => tx.payComponent.create({ data: { ...data, tenantId } }));
  }

  listComponents(tenantId: string): Promise<PayComponent[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.payComponent.findMany({ where: { tenantId }, orderBy: { code: "asc" } }),
    );
  }

  findComponentByCode(tenantId: string, code: string): Promise<PayComponent | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.payComponent.findFirst({ where: { tenantId, code } }));
  }

  findComponentById(tenantId: string, id: string): Promise<PayComponent | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.payComponent.findFirst({ where: { id, tenantId } }));
  }

  assign(
    tenantId: string,
    data: { employeeId: string; payComponentId: string; value?: number },
  ): Promise<EmployeePayComponentWithComponent> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.employeePayComponent.upsert({
        where: { tenantId_employeeId_payComponentId: { tenantId, employeeId: data.employeeId, payComponentId: data.payComponentId } },
        create: { ...data, tenantId },
        update: { value: data.value, isActive: true },
        include: includeComponent,
      }),
    );
  }

  /** Deactivates an assignment without deleting it — used when a benefit enrollment is waived or terminated. */
  setActive(tenantId: string, employeeId: string, payComponentId: string, isActive: boolean): Promise<EmployeePayComponent> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.employeePayComponent.update({
        where: { tenantId_employeeId_payComponentId: { tenantId, employeeId, payComponentId } },
        data: { isActive },
      }),
    );
  }

  findForEmployee(tenantId: string, employeeId: string): Promise<EmployeePayComponentWithComponent[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.employeePayComponent.findMany({ where: { tenantId, employeeId }, include: includeComponent }),
    );
  }

  /** For payroll run processing — all active assignments across a batch of employees in one query. */
  findActiveForEmployeeIds(tenantId: string, employeeIds: string[]): Promise<EmployeePayComponentWithComponent[]> {
    if (employeeIds.length === 0) return Promise.resolve([]);
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.employeePayComponent.findMany({
        where: { tenantId, employeeId: { in: employeeIds }, isActive: true, payComponent: { isActive: true } },
        include: includeComponent,
      }),
    );
  }
}
