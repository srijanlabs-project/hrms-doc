import { Body, Controller, Get, HttpCode, Param, Post, Query } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { AddCommentDto } from "./dto/add-comment.dto";
import { AssignTicketDto } from "./dto/assign-ticket.dto";
import { CloseTicketDto } from "./dto/close-ticket.dto";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { TicketService } from "./ticket.service";

/** HTTP only — no business logic. Spec: docs/03-module-specifications/19-helpdesk-case-management.md */
@Controller("helpdesk/tickets")
export class TicketController {
  constructor(private readonly service: TicketService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateTicketDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Get("my")
  async listMine() {
    const data = await this.service.listMine();
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Get("all")
  async listAll(@Query("queue") queue?: string, @Query("status") status?: string) {
    const data = await this.service.listAll(queue, status);
    return { data };
  }

  @Get(":id")
  async getById(@Param("id") id: string) {
    const data = await this.service.getById(id);
    return { data };
  }

  @Post(":id/comments")
  @HttpCode(201)
  async addComment(@Param("id") id: string, @Body() dto: AddCommentDto) {
    const data = await this.service.addComment(id, dto);
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post(":id/assign")
  @HttpCode(200)
  async assign(@Param("id") id: string, @Body() dto: AssignTicketDto) {
    const data = await this.service.assign(id, dto);
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post(":id/start-progress")
  @HttpCode(200)
  async startProgress(@Param("id") id: string) {
    const data = await this.service.startProgress(id);
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post(":id/resolve")
  @HttpCode(200)
  async resolve(@Param("id") id: string) {
    const data = await this.service.resolve(id);
    return { data };
  }

  @Post(":id/close")
  @HttpCode(200)
  async close(@Param("id") id: string, @Body() dto: CloseTicketDto) {
    const data = await this.service.close(id, dto);
    return { data };
  }

  @Post(":id/reopen")
  @HttpCode(200)
  async reopen(@Param("id") id: string) {
    const data = await this.service.reopen(id);
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post("escalation-sweep/run-now")
  @HttpCode(200)
  async runEscalationSweepNow() {
    await this.service.runEscalationSweepNow();
    return { data: { triggered: true } };
  }
}
