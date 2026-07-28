import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { CreateCommunityDto } from "./dto/create-community.dto";
import { CommunityService } from "./community.service";

/** HTTP only — no business logic. Wave 4 W4·E15 gap closure: communities. */
@Controller("experience/communities")
export class CommunityController {
  constructor(private readonly service: CommunityService) {}

  @Get()
  async listAll() {
    const data = await this.service.listAllWithMembership();
    return { data };
  }

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateCommunityDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Post(":id/join")
  @HttpCode(200)
  async join(@Param("id") id: string) {
    const data = await this.service.join(id);
    return { data };
  }

  @Post(":id/leave")
  @HttpCode(200)
  async leave(@Param("id") id: string) {
    const data = await this.service.leave(id);
    return { data };
  }
}
