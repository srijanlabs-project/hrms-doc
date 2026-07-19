import { Module } from "@nestjs/common";
import { DepartmentController } from "./department/department.controller";
import { DepartmentRepository } from "./department/department.repository";
import { DepartmentService } from "./department/department.service";
import { LegalEntityController } from "./legal-entity/legal-entity.controller";
import { LegalEntityRepository } from "./legal-entity/legal-entity.repository";
import { LegalEntityService } from "./legal-entity/legal-entity.service";

/** Org & Tenant Core service boundary — docs/03-module-specifications/01-organization-management.md. */
@Module({
  controllers: [LegalEntityController, DepartmentController],
  providers: [LegalEntityService, LegalEntityRepository, DepartmentService, DepartmentRepository],
  exports: [DepartmentRepository],
})
export class OrgModule {}
