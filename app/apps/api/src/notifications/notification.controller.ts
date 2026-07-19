import { Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { NotificationService } from "./notification.service";

@Controller("notifications")
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  @Get()
  async list() {
    const data = await this.service.list();
    return { data };
  }

  @Post(":id/read")
  @HttpCode(200)
  async markRead(@Param("id") id: string) {
    await this.service.markRead(id);
    return { data: { read: true } };
  }

  @Post("read-all")
  @HttpCode(200)
  async markAllRead() {
    await this.service.markAllRead();
    return { data: { read: true } };
  }
}
