import { Injectable } from "@nestjs/common";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, NotFoundAppError } from "../../platform/errors/errors";
import { CourseRepository } from "./course.repository";
import type { CreateCourseDto } from "./dto/create-course.dto";

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-COURSE-001",
    code: "COURSE-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-COURSE",
    details: { currentState },
  });
}

/**
 * v1 slice of docs/08-submodule-specifications/12-learning-and-development/01-learning-management-system.md:
 * a flat admin-managed catalog with a Draft -> Published -> Archived lifecycle.
 * No programs/pathways/cohorts/sessions, no authoring workflow beyond a single
 * publish action — see schema.prisma's LearningCourse comment.
 */
@Injectable()
export class CourseService {
  constructor(
    private readonly repository: CourseRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async create(dto: CreateCourseDto) {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.create(tenantId, {
      title: dto.title,
      description: dto.description,
      durationHours: dto.durationHours,
      isMandatory: dto.isMandatory,
      recurrenceMonths: dto.recurrenceMonths,
      passingScore: dto.passingScore,
      skillTags: dto.skillTags ?? [],
    });
  }

  async listCatalog() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findPublished(tenantId);
  }

  async listAll() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findAll(tenantId);
  }

  async publish(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const course = await this.findOrThrow(tenantId, id);
    if (course.status !== "Draft") {
      throw stateConflict("Only a Draft course can be published.", course.status);
    }
    return this.repository.updateStatus(tenantId, id, "Published");
  }

  async archive(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const course = await this.findOrThrow(tenantId, id);
    if (course.status !== "Published") {
      throw stateConflict("Only a Published course can be archived.", course.status);
    }
    return this.repository.updateStatus(tenantId, id, "Archived");
  }

  private async findOrThrow(tenantId: string, id: string) {
    const course = await this.repository.findById(tenantId, id);
    if (!course) {
      throw new NotFoundAppError("OBJ-COURSE", "Course not found.");
    }
    return course;
  }

  private requireAuthenticated(): { tenantId: string } {
    const { tenantId } = this.requestContext.store ?? {};
    if (!tenantId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId };
  }
}
