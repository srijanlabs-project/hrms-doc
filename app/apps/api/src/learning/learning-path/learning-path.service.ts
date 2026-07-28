import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, NotFoundAppError } from "../../platform/errors/errors";
import { EnrollmentService } from "../enrollment/enrollment.service";
import type { CreateLearningPathDto } from "./dto/create-path.dto";
import type { LearningPathWithCourses } from "./learning-path.repository";
import { LearningPathRepository } from "./learning-path.repository";

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-LEARNING-PATH-001",
    code: "LEARNING-PATH-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-LEARNING-PATH",
    details: { currentState },
  });
}

export interface LearningPathProgress {
  path: LearningPathWithCourses;
  completedCourses: number;
  totalCourses: number;
  isComplete: boolean;
}

/**
 * W3·E12 gap closure ("learning paths") — a curated, ordered course sequence.
 * Progress is always computed live from LearningEnrollment, never stored —
 * see schema.prisma's LearningPath doc comment.
 */
@Injectable()
export class LearningPathService {
  constructor(
    private readonly repository: LearningPathRepository,
    private readonly enrollmentService: EnrollmentService,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
  ) {}

  async create(dto: CreateLearningPathDto) {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.create(tenantId, { title: dto.title, description: dto.description, courseIds: dto.courseIds });
  }

  async publish(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const path = await this.findOrThrow(tenantId, id);
    if (path.status !== "Draft") {
      throw stateConflict("Only a Draft path can be published.", path.status);
    }
    return this.repository.updateStatus(tenantId, id, "Published");
  }

  async listCatalog() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findPublished(tenantId);
  }

  async listAllAdmin() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findAll(tenantId);
  }

  async enroll(pathId: string) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const path = await this.findOrThrow(tenantId, pathId);
    if (path.status !== "Published") {
      throw stateConflict("Only a Published path can be enrolled into.", path.status);
    }

    try {
      await this.repository.createEnrollment(tenantId, employee.id, pathId);
    } catch (err) {
      if (!(err instanceof Prisma.PrismaClientKnownRequestError) || err.code !== "P2002") {
        throw err;
      }
      throw stateConflict("You are already enrolled in this path.", "Duplicate");
    }

    for (const pathCourse of path.courses) {
      try {
        await this.enrollmentService.enroll(pathCourse.course.id);
      } catch {
        // Already enrolled in this course (via the path or independently), or
        // the course has since been archived — neither blocks path enrollment.
      }
    }

    return this.getProgress(path, tenantId, employee.id);
  }

  async listMine(): Promise<LearningPathProgress[]> {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const enrollments = await this.repository.findEnrollmentsForEmployee(tenantId, employee.id);
    return Promise.all(enrollments.map((e) => this.getProgress(e.path, tenantId, employee.id)));
  }

  private async getProgress(path: LearningPathWithCourses, tenantId: string, employeeId: string): Promise<LearningPathProgress> {
    const courseIds = path.courses.map((c) => c.course.id);
    const completedCourses = courseIds.length
      ? await this.repository.countCompletedEnrollments(tenantId, employeeId, courseIds)
      : 0;
    return { path, completedCourses, totalCourses: courseIds.length, isComplete: completedCourses === courseIds.length && courseIds.length > 0 };
  }

  private async findOrThrow(tenantId: string, id: string) {
    const path = await this.repository.findById(tenantId, id);
    if (!path) {
      throw new NotFoundAppError("OBJ-LEARNING-PATH", "Learning path not found.");
    }
    return path;
  }

  private requireAuthenticated(): { tenantId: string } {
    const { tenantId } = this.requestContext.store ?? {};
    if (!tenantId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId };
  }
}
