import { Module } from "@nestjs/common";
import { LegalEntityController } from "./legal-entity/legal-entity.controller";
import { LegalEntityRepository } from "./legal-entity/legal-entity.repository";
import { LegalEntityService } from "./legal-entity/legal-entity.service";

/** Org & Tenant Core service boundary — docs/03-module-specifications/01-organization-management.md. */
@Module({
  controllers: [LegalEntityController],
  providers: [LegalEntityService, LegalEntityRepository],
})
export class OrgModule {}
