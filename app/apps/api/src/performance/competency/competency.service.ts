import { Injectable } from "@nestjs/common";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { EmployeeRepository } from "../../people/employee/employee.repository";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AuthenticationAppError, ForbiddenAppError, NotFoundAppError } from "../../platform/errors/errors";
import type { AssessCompetencyDto } from "./dto/assess-competency.dto";
import type { CreateCompetencyDto } from "./dto/create-competency.dto";
import { CompetencyRepository } from "./competency.repository";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/**
 * Wave 3 W3·E11 Performance Management deepening — Competency framework
 * (docs/03-module-specifications/11-performance-management.md's
 * competencies catalog item). Admin-managed competency catalog; one rating
 * per employee per competency per period, rated by the employee's manager
 * or org_admin/hr_ops — a single-rater skill assessment, distinct from the
 * already-built 360 Feedback's multi-rater mechanism.
 */
@Injectable()
export class CompetencyService {
  constructor(
    private readonly repository: CompetencyRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
  ) {}

  /** org_admin/hr_ops only — see controller's @Roles guard. */
  async createCatalogEntry(dto: CreateCompetencyDto) {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.createCatalogEntry(tenantId, { name: dto.name, description: dto.description });
  }

  async listCatalog() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findCatalog(tenantId);
  }

  async listMine() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.repository.findForEmployee(tenantId, employee.id);
  }

  async listForEmployee(employeeId: string) {
    const { tenantId } = await this.assertManagerOrAdmin(employeeId);
    return this.repository.findForEmployee(tenantId, employeeId);
  }

  async assess(dto: AssessCompetencyDto) {
    const { tenantId, userId } = await this.assertManagerOrAdmin(dto.employeeId);

    const competency = await this.repository.findCompetencyById(tenantId, dto.competencyId);
    if (!competency) {
      throw new NotFoundAppError("OBJ-COMPETENCY", "Competency not found.");
    }

    return this.repository.upsertAssessment(tenantId, {
      employeeId: dto.employeeId,
      competencyId: dto.competencyId,
      periodYear: dto.periodYear,
      rating: dto.rating,
      comments: dto.comments,
      assessedByUserId: userId,
    });
  }

  private async assertManagerOrAdmin(employeeId: string): Promise<{ tenantId: string; userId: string }> {
    const { tenantId, userId } = this.requireAuthenticated();
    const isAdmin = ADMIN_ROLES.some((role) => this.requestContext.roles.includes(role));
    if (isAdmin) return { tenantId, userId };

    const { employee: caller } = await this.currentEmployee.resolve();
    const target = await this.employeeRepository.findById(tenantId, employeeId);
    if (!target || target.managerId !== caller.id) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
