import { Injectable } from "@nestjs/common";
import { RequestContextService } from "../../platform/context/request-context.service";
import { TenantBoundaryError } from "../../platform/errors/errors";
import { CompanyRepository } from "../company/company.repository";
import { DepartmentRepository } from "../department/department.repository";
import { OrgUnitRepository } from "../org-unit/org-unit.repository";

interface TreeNode {
  id: string;
  code: string;
  name: string;
  type: string;
  children: TreeNode[];
}

function buildHierarchy<T extends { id: string; code: string; name: string }>(
  items: T[],
  getParentId: (item: T) => string | null,
  type: string,
): TreeNode[] {
  const nodeById = new Map<string, TreeNode>();
  for (const item of items) {
    nodeById.set(item.id, { id: item.id, code: item.code, name: item.name, type, children: [] });
  }
  const roots: TreeNode[] = [];
  for (const item of items) {
    const node = nodeById.get(item.id)!;
    const parentId = getParentId(item);
    const parentNode = parentId ? nodeById.get(parentId) : undefined;
    if (parentNode) {
      parentNode.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

/**
 * v1 slice of docs/08-submodule-specifications/01-organization-management/04-organization-tree.md:
 * a read-only, computed assembly over the real Company/OrgUnit/Department
 * tables — not a separate generic org_node/snapshot/reorg-event engine. No
 * effective-dating, no reorganization simulation.
 */
@Injectable()
export class OrgTreeService {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly orgUnitRepository: OrgUnitRepository,
    private readonly departmentRepository: DepartmentRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async getTree() {
    const tenantId = this.requireTenantId();
    const [companies, orgUnits, departments] = await Promise.all([
      this.companyRepository.findAll(tenantId),
      this.orgUnitRepository.findAll(tenantId),
      this.departmentRepository.findAll(tenantId),
    ]);

    return {
      companies: buildHierarchy(companies, (c) => c.parentCompanyId, "Company"),
      orgUnits: buildHierarchy(orgUnits, (u) => u.parentUnitId, "OrgUnit"),
      departments: buildHierarchy(departments, (d) => d.parentDepartmentId, "Department"),
    };
  }

  private requireTenantId(): string {
    const tenantId = this.requestContext.tenantId;
    if (!tenantId) {
      throw new TenantBoundaryError(this.requestContext.correlationId);
    }
    return tenantId;
  }
}
