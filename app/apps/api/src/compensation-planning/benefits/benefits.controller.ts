import { Body, Controller, Get, HttpCode, Param, Post, Query } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { BenefitsService } from "./benefits.service";
import { CreateBenefitPlanDto } from "./dto/create-plan.dto";
import { EnrollBenefitDto } from "./dto/enroll.dto";
import { SetFlexBasketDto } from "./dto/set-flex-basket.dto";
import { WaiveBenefitDto } from "./dto/waive.dto";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/** HTTP only — no business logic. Spec: 08-submodule-specifications/14-compensation-and-benefits/{04-benefits-administration,05-flexible-benefits}.md */
@Controller("benefits")
export class BenefitsController {
  constructor(private readonly service: BenefitsService) {}

  @Get("plans")
  async listActivePlans() {
    const data = await this.service.listActivePlans();
    return { data };
  }

  @Roles(...ADMIN_ROLES)
  @Get("plans/admin")
  async listAllPlans() {
    const data = await this.service.listAllPlans();
    return { data };
  }

  @Roles(...ADMIN_ROLES)
  @Post("plans")
  @HttpCode(201)
  async createPlan(@Body() dto: CreateBenefitPlanDto) {
    const data = await this.service.createPlan(dto);
    return { data };
  }

  @Get("flex-basket")
  async getFlexBasketStatus() {
    const data = await this.service.getFlexBasketStatus();
    return { data };
  }

  @Roles(...ADMIN_ROLES)
  @Post("flex-basket")
  @HttpCode(200)
  async setFlexBasket(@Body() dto: SetFlexBasketDto) {
    const data = await this.service.setFlexBasket(dto.annualAmount);
    return { data };
  }

  @Get("enrollments/my")
  async listMine() {
    const data = await this.service.listMine();
    return { data };
  }

  @Roles(...ADMIN_ROLES)
  @Get("enrollments")
  async listAllEnrollments(@Query("status") status?: string) {
    const data = await this.service.listAllEnrollments(status);
    return { data };
  }

  @Post("enrollments")
  @HttpCode(201)
  async enroll(@Body() dto: EnrollBenefitDto) {
    const data = await this.service.enroll(dto);
    return { data };
  }

  @Post("enrollments/:id/waive")
  @HttpCode(200)
  async waive(@Param("id") id: string, @Body() dto: WaiveBenefitDto) {
    const data = await this.service.waive(id, dto.reason);
    return { data };
  }

  @Roles(...ADMIN_ROLES)
  @Post("enrollments/:id/terminate")
  @HttpCode(200)
  async terminate(@Param("id") id: string) {
    const data = await this.service.terminate(id);
    return { data };
  }
}
