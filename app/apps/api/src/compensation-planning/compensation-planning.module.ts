import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { PayComponentRepository } from "../payroll/pay-component/pay-component.repository";
import { PayrollModule } from "../payroll/payroll.module";
import { PeopleModule } from "../people/people.module";
import { BenefitsController } from "./benefits/benefits.controller";
import { BenefitsRepository } from "./benefits/benefits.repository";
import { BenefitsService } from "./benefits/benefits.service";
import { CycleController } from "./cycle/cycle.controller";
import { CycleRepository } from "./cycle/cycle.repository";
import { CycleService } from "./cycle/cycle.service";
import { ItemController } from "./item/item.controller";
import { ItemRepository } from "./item/item.repository";
import { ItemService } from "./item/item.service";

/** Compensation Planning, Phase 7 — docs/08-submodule-specifications/14-compensation-and-benefits/, deepened per Wave 3 E14. */
@Module({
  imports: [AuthModule, PeopleModule, PayrollModule],
  controllers: [CycleController, ItemController, BenefitsController],
  providers: [
    CycleService,
    CycleRepository,
    ItemService,
    ItemRepository,
    BenefitsService,
    BenefitsRepository,
    PayComponentRepository,
  ],
})
export class CompensationPlanningModule {}
