import { Controller, Get, HttpStatus, Res } from "@nestjs/common";
import type { Response } from "express";
import { Public } from "../auth/decorators/public.decorator";
import { PrismaService } from "./prisma/prisma.service";

/**
 * W0·E30 DevOps and Operations — real readiness check. Previously always
 * returned "up" regardless of database state; now runs a live `SELECT 1`
 * so a genuinely broken DB connection surfaces as 503, not a false green.
 */
@Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Get()
  async getHealth(@Res() res: Response) {
    const time = new Date().toISOString();
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      res.status(HttpStatus.OK).json({ data: { service: "staffsy-api", status: "up", database: "up", time } });
    } catch {
      res.status(HttpStatus.SERVICE_UNAVAILABLE).json({ data: { service: "staffsy-api", status: "down", database: "down", time } });
    }
  }
}
