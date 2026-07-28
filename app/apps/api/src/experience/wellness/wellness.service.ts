import { Injectable } from "@nestjs/common";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, NotFoundAppError } from "../../platform/errors/errors";
import type { CreateWellnessProgramDto } from "./dto/create-wellness-program.dto";
import { WellnessRepository } from "./wellness.repository";

/** Wave 4 W4·E15 gap closure ("wellness programs") — catalog + enrollment, mirroring LearningCourse/LearningEnrollment. */
@Injectable()
export class WellnessService {
  constructor(
    private readonly repository: WellnessRepository,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
  ) {}

  async create(dto: CreateWellnessProgramDto) {
    const { tenantId, userId } = this.requireAuthenticated();
    return this.repository.create(tenantId, {
      title: dto.title,
      description: dto.description,
      category: dto.category ?? "Other",
      startDate: new Date(dto.startDate),
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      createdByUserId: userId,
    });
  }

  async listAllWithEnrollment() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const [programs, myEnrollments] = await Promise.all([
      this.repository.findAllActive(tenantId),
      this.repository.findMyEnrollments(tenantId, employee.id),
    ]);
    const myProgramIds = new Set(myEnrollments.map((e) => e.programId));
    return programs.map((p) => ({ ...p, isEnrolled: myProgramIds.has(p.id) }));
  }

  async enroll(programId: string) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const program = await this.findOrThrow(tenantId, programId);
    const existing = await this.repository.findMyEnrollment(tenantId, program.id, employee.id);
    if (existing) {
      throw new AppError({
        errorRef: "ERR-WELLNESS-001",
        code: "WELLNESS-001",
        category: "state-conflict",
        severity: "low",
        httpStatus: 409,
        message: "You are already enrolled in this program.",
        retryable: false,
        tenantSafe: true,
        objectRef: "OBJ-WELLNESS-ENROLLMENT",
      });
    }
    return this.repository.enroll(tenantId, program.id, employee.id);
  }

  private async findOrThrow(tenantId: string, id: string) {
    const program = await this.repository.findById(tenantId, id);
    if (!program) {
      throw new NotFoundAppError("OBJ-WELLNESS-PROGRAM", "Wellness program not found.");
    }
    return program;
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
