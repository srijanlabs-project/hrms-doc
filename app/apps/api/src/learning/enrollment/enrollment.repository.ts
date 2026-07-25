import { Injectable } from "@nestjs/common";
import type { LearningEnrollment, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type EnrollmentWithCourse = LearningEnrollment & {
  course: { id: string; title: string; durationHours: number; isMandatory: boolean };
};

export type EnrollmentWithEmployeeAndCourse = EnrollmentWithCourse & {
  employee: { id: string; legalName: string; employeeCode: string };
};

const includeCourse = {
  course: { select: { id: true, title: true, durationHours: true, isMandatory: true } },
} satisfies Prisma.LearningEnrollmentInclude;

const includeEmployeeAndCourse = {
  ...includeCourse,
  employee: { select: { id: true, legalName: true, employeeCode: true } },
} satisfies Prisma.LearningEnrollmentInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class EnrollmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    tenantId: string,
    employeeId: string,
    courseId: string,
    data: { dueDate?: Date; assignedAutomatically?: boolean } = {},
  ): Promise<EnrollmentWithCourse> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.learningEnrollment.create({ data: { tenantId, employeeId, courseId, ...data }, include: includeCourse }),
    );
  }

  findForEmployee(tenantId: string, employeeId: string): Promise<EnrollmentWithCourse[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.learningEnrollment.findMany({
        where: { tenantId, employeeId },
        include: includeCourse,
        orderBy: { createdAt: "desc" },
      }),
    );
  }

  findForEmployees(tenantId: string, employeeIds: string[]): Promise<EnrollmentWithEmployeeAndCourse[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.learningEnrollment.findMany({
        where: { tenantId, employeeId: { in: employeeIds }, assignedAutomatically: true },
        include: includeEmployeeAndCourse,
        orderBy: { dueDate: "asc" },
      }),
    );
  }

  findByEmployeeAndCourse(tenantId: string, employeeId: string, courseId: string): Promise<LearningEnrollment | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.learningEnrollment.findFirst({ where: { tenantId, employeeId, courseId } }),
    );
  }

  /** Enrolled, system-assigned rows with a due date — the sweep's candidate pool. */
  findAssignedEnrolled(tenantId: string): Promise<EnrollmentWithEmployeeAndCourse[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.learningEnrollment.findMany({
        where: { tenantId, status: "Enrolled", assignedAutomatically: true, dueDate: { not: null } },
        include: includeEmployeeAndCourse,
      }),
    );
  }

  findOverdue(tenantId: string): Promise<EnrollmentWithEmployeeAndCourse[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.learningEnrollment.findMany({
        where: { tenantId, status: "Overdue" },
        include: includeEmployeeAndCourse,
      }),
    );
  }

  findById(tenantId: string, id: string): Promise<EnrollmentWithCourse | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.learningEnrollment.findFirst({ where: { id, tenantId }, include: includeCourse }),
    );
  }

  updateStatus(
    tenantId: string,
    id: string,
    data: { status: string; completedAt?: Date | null; dueDate?: Date | null },
  ): Promise<LearningEnrollment> {
    return this.prisma.withTenant(tenantId, (tx) => tx.learningEnrollment.update({ where: { id }, data }));
  }
}
