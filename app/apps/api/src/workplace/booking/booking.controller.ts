import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { BookingService } from "./booking.service";
import { CreateBookingDto } from "./dto/create-booking.dto";

/** HTTP only — no business logic. Spec: docs/03-module-specifications/21-visitor-workplace-management.md */
@Controller("workplace/bookings")
export class BookingController {
  constructor(private readonly service: BookingService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateBookingDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Get("mine")
  async listMine() {
    const data = await this.service.listMine();
    return { data };
  }

  @Get()
  @Roles("org_admin", "hr_ops")
  async listAll() {
    const data = await this.service.listAll();
    return { data };
  }

  @Post(":id/cancel")
  @HttpCode(200)
  async cancel(@Param("id") id: string) {
    const data = await this.service.cancel(id);
    return { data };
  }
}
