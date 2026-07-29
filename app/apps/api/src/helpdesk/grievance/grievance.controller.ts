import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { AssignGrievanceHandlerDto } from "./dto/assign-grievance-handler.dto";
import { ResolveGrievanceCaseDto } from "./dto/resolve-grievance-case.dto";
import { SubmitGrievanceCaseDto } from "./dto/submit-grievance-case.dto";
import { GrievanceService } from "./grievance.service";

/** HTTP only — no business logic. Wave 4·E19 gap closure ("employee relations and grievance management"). */
@Controller("helpdesk/grievance-cases")
export class GrievanceController {
  constructor(private readonly service: GrievanceService) {}

  @Post()
  @HttpCode(201)
  async submit(@Body() dto: SubmitGrievanceCaseDto) {
    const data = await this.service.submit(dto);
    return { data };
  }

  @Get("my")
  async listMine() {
    const data = await this.service.listMine();
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Get("all")
  async listAll() {
    const data = await this.service.listAllAdmin();
    return { data };
  }

  @Get(":id")
  async getById(@Param("id") id: string) {
    const data = await this.service.getById(id);
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post(":id/assign-handler")
  @HttpCode(200)
  async assignHandler(@Param("id") id: string, @Body() dto: AssignGrievanceHandlerDto) {
    const data = await this.service.assignHandler(id, dto);
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post(":id/resolve")
  @HttpCode(200)
  async resolve(@Param("id") id: string, @Body() dto: ResolveGrievanceCaseDto) {
    const data = await this.service.resolve(id, dto.resolutionSummary);
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post(":id/close")
  @HttpCode(200)
  async close(@Param("id") id: string) {
    const data = await this.service.close(id);
    return { data };
  }
}
