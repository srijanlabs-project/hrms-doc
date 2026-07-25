import { Module } from "@nestjs/common";
import { CompanyController } from "./company/company.controller";
import { CompanyRepository } from "./company/company.repository";
import { CompanyService } from "./company/company.service";
import { DepartmentController } from "./department/department.controller";
import { DepartmentRepository } from "./department/department.repository";
import { DepartmentService } from "./department/department.service";
import { DesignationController } from "./designation/designation.controller";
import { DesignationRepository } from "./designation/designation.repository";
import { DesignationService } from "./designation/designation.service";
import { FinancialCenterController } from "./financial-center/financial-center.controller";
import { FinancialCenterRepository } from "./financial-center/financial-center.repository";
import { FinancialCenterService } from "./financial-center/financial-center.service";
import { GradeController } from "./grade/grade.controller";
import { GradeRepository } from "./grade/grade.repository";
import { GradeService } from "./grade/grade.service";
import { JobFamilyController } from "./job-family/job-family.controller";
import { JobFamilyRepository } from "./job-family/job-family.repository";
import { JobFamilyService } from "./job-family/job-family.service";
import { JobFunctionController } from "./job-function/job-function.controller";
import { JobFunctionRepository } from "./job-function/job-function.repository";
import { JobFunctionService } from "./job-function/job-function.service";
import { LegalEntityController } from "./legal-entity/legal-entity.controller";
import { LegalEntityRepository } from "./legal-entity/legal-entity.repository";
import { LegalEntityService } from "./legal-entity/legal-entity.service";
import { EmployeeRepository } from "../people/employee/employee.repository";
import { OrgPolicyController } from "./policy/org-policy.controller";
import { OrgPolicyRepository } from "./policy/org-policy.repository";
import { OrgPolicyService } from "./policy/org-policy.service";
import { OrgTreeController } from "./org-tree/org-tree.controller";
import { OrgTreeService } from "./org-tree/org-tree.service";
import { OrgUnitController } from "./org-unit/org-unit.controller";
import { OrgUnitRepository } from "./org-unit/org-unit.repository";
import { OrgUnitService } from "./org-unit/org-unit.service";
import { PositionController } from "./position/position.controller";
import { PositionRepository } from "./position/position.repository";
import { PositionService } from "./position/position.service";
import { ReportingLineController } from "./reporting-line/reporting-line.controller";
import { ReportingLineRepository } from "./reporting-line/reporting-line.repository";
import { ReportingLineService } from "./reporting-line/reporting-line.service";
import { WorkCalendarController } from "./work-calendar/work-calendar.controller";
import { WorkCalendarRepository } from "./work-calendar/work-calendar.repository";
import { WorkCalendarService } from "./work-calendar/work-calendar.service";

/**
 * Org & Tenant Core service boundary — docs/03-module-specifications/01-organization-management.md.
 * Wave 1 deepening pass (see task tracker #75): every sub-capability beyond
 * the original legal-entity/department proving slice lives here too, so the
 * whole Organization Management catalog is one cohesive service boundary.
 */
@Module({
  controllers: [
    LegalEntityController,
    DepartmentController,
    CompanyController,
    OrgUnitController,
    FinancialCenterController,
    ReportingLineController,
    JobFamilyController,
    JobFunctionController,
    DesignationController,
    GradeController,
    PositionController,
    WorkCalendarController,
    OrgPolicyController,
    OrgTreeController,
  ],
  providers: [
    LegalEntityService,
    LegalEntityRepository,
    DepartmentService,
    DepartmentRepository,
    CompanyService,
    CompanyRepository,
    OrgUnitService,
    OrgUnitRepository,
    FinancialCenterService,
    FinancialCenterRepository,
    ReportingLineService,
    ReportingLineRepository,
    JobFamilyService,
    JobFamilyRepository,
    JobFunctionService,
    JobFunctionRepository,
    DesignationService,
    DesignationRepository,
    GradeService,
    GradeRepository,
    PositionService,
    PositionRepository,
    WorkCalendarService,
    WorkCalendarRepository,
    OrgPolicyService,
    OrgPolicyRepository,
    OrgTreeService,
    EmployeeRepository,
  ],
  exports: [DepartmentRepository, GradeRepository, PositionRepository, FinancialCenterRepository],
})
export class OrgModule {}
