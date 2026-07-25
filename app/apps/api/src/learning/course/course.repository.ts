import { Injectable } from "@nestjs/common";
import type { LearningCourse, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class CourseRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    tenantId: string,
    data: Omit<Prisma.LearningCourseUncheckedCreateInput, "tenantId">,
  ): Promise<LearningCourse> {
    return this.prisma.withTenant(tenantId, (tx) => tx.learningCourse.create({ data: { ...data, tenantId } }));
  }

  findAll(tenantId: string): Promise<LearningCourse[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.learningCourse.findMany({ where: { tenantId }, orderBy: { createdAt: "desc" } }),
    );
  }

  findPublished(tenantId: string): Promise<LearningCourse[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.learningCourse.findMany({ where: { tenantId, status: "Published" }, orderBy: { title: "asc" } }),
    );
  }

  /** Compliance training's assignment population — Published + mandatory only. */
  findPublishedMandatory(tenantId: string): Promise<LearningCourse[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.learningCourse.findMany({ where: { tenantId, status: "Published", isMandatory: true } }),
    );
  }

  findById(tenantId: string, id: string): Promise<LearningCourse | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.learningCourse.findFirst({ where: { id, tenantId } }));
  }

  updateStatus(tenantId: string, id: string, status: string): Promise<LearningCourse> {
    return this.prisma.withTenant(tenantId, (tx) => tx.learningCourse.update({ where: { id }, data: { status } }));
  }
}
