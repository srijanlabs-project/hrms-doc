import { Body, Controller, Get, Param, Put, Query } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { SetDepartmentBudgetDto } from "./dto/set-department-budget.dto";
import { DepartmentBudgetService } from "./department-budget.service";

function parseYear(year?: string): number | undefined {
  return year ? parseInt(year, 10) : undefined;
}

/** HTTP only — no business logic. W5·P gap closure ("budget approvals"). */
@Controller("mss/budget")
export class DepartmentBudgetController {
  constructor(private readonly service: DepartmentBudgetService) {}

  @Get("mine")
  async getMine(@Query("year") year?: string) {
    const data = await this.service.getMine(parseYear(year));
    return { data };
  }

  @Get("departments/:departmentId")
  @Roles("org_admin", "hr_ops")
  async getForDepartment(@Param("departmentId") departmentId: string, @Query("year") year?: string) {
    const data = await this.service.getForDepartment(departmentId, parseYear(year));
    return { data };
  }

  @Put("departments/:departmentId")
  @Roles("org_admin", "hr_ops")
  async setAllocation(@Param("departmentId") departmentId: string, @Body() dto: SetDepartmentBudgetDto) {
    const data = await this.service.setAllocation(departmentId, dto);
    return { data };
  }
}
