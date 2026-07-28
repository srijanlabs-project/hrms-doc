import { Injectable } from "@nestjs/common";
import type { LearningPath, LearningPathEnrollment, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type LearningPathWithCourses = LearningPath & {
  courses: Array<{
    id: string;
    sequenceOrder: number;
    course: { id: string; title: string; durationHours: number };
  }>;
};

export type LearningPathEnrollmentWithPath = LearningPathEnrollment & { path: LearningPathWithCourses };

const includeCourses = {
  courses: {
    orderBy: { sequenceOrder: "asc" },
    include: { course: { select: { id: true, title: true, durationHours: true } } },
  },
} satisfies Prisma.LearningPathInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class LearningPathRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    tenantId: string,
    data: { title: string; description?: string; courseIds: string[] },
  ): Promise<LearningPathWithCourses> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.learningPath.create({
        data: {
          tenantId,
          title: data.title,
          description: data.description,
          courses: {
            create: data.courseIds.map((courseId, index) => ({ tenantId, courseId, sequenceOrder: index })),
          },
        },
        include: includeCourses,
      }),
    );
  }

  findPublished(tenantId: string): Promise<LearningPathWithCourses[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.learningPath.findMany({ where: { tenantId, status: "Published" }, include: includeCourses, orderBy: { title: "asc" } }),
    );
  }

  findAll(tenantId: string): Promise<LearningPathWithCourses[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.learningPath.findMany({ where: { tenantId }, include: includeCourses, orderBy: { createdAt: "desc" } }),
    );
  }

  findById(tenantId: string, id: string): Promise<LearningPathWithCourses | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.learningPath.findFirst({ where: { id, tenantId }, include: includeCourses }),
    );
  }

  updateStatus(tenantId: string, id: string, status: string): Promise<LearningPath> {
    return this.prisma.withTenant(tenantId, (tx) => tx.learningPath.update({ where: { id }, data: { status } }));
  }

  createEnrollment(tenantId: string, employeeId: string, pathId: string): Promise<LearningPathEnrollment> {
    return this.prisma.withTenant(tenantId, (tx) => tx.learningPathEnrollment.create({ data: { tenantId, employeeId, pathId } }));
  }

  findEnrollmentsForEmployee(tenantId: string, employeeId: string): Promise<LearningPathEnrollmentWithPath[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.learningPathEnrollment.findMany({
        where: { tenantId, employeeId },
        include: { path: { include: includeCourses } },
        orderBy: { createdAt: "desc" },
      }),
    );
  }

  /** Completed-course count for a set of courseIds, for one employee — the live progress computation. */
  countCompletedEnrollments(tenantId: string, employeeId: string, courseIds: string[]): Promise<number> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.learningEnrollment.count({ where: { tenantId, employeeId, courseId: { in: courseIds }, status: "Completed" } }),
    );
  }
}
