import { Module } from "@nestjs/common";
import { LeaveModule } from "../leave/leave.module";
import { OrgModule } from "../org/org.module";
import { PeopleModule } from "../people/people.module";
import { GoLiveChecklistController } from "./checklist/go-live-checklist.controller";
import { GoLiveChecklistRepository } from "./checklist/go-live-checklist.repository";
import { GoLiveChecklistService } from "./checklist/go-live-checklist.service";
import { ImportBatchController } from "./import-batch/import-batch.controller";
import { ImportBatchRepository } from "./import-batch/import-batch.repository";
import { ImportEngineService } from "./import-batch/import-engine.service";

/** W0·E31 Implementation and Migration. Imports OrgModule/LeaveModule/PeopleModule to reuse each module's existing create(dto) service for the generic import engine, rather than duplicating creation logic. */
@Module({
  imports: [OrgModule, LeaveModule, PeopleModule],
  controllers: [ImportBatchController, GoLiveChecklistController],
  providers: [ImportEngineService, ImportBatchRepository, GoLiveChecklistService, GoLiveChecklistRepository],
})
export class ImplementationModule {}
