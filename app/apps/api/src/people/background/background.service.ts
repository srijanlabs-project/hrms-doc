import { Injectable } from "@nestjs/common";
import { AuthRepository } from "../../auth/auth.repository";
import { RequestContextService } from "../../platform/context/request-context.service";
import { ForbiddenAppError, NotFoundAppError } from "../../platform/errors/errors";
import { EmployeeRepository } from "../employee/employee.repository";
import { BackgroundRepository } from "./background.repository";
import type { CreateCertificationDto } from "./dto/create-certification.dto";
import type { CreateEducationDto } from "./dto/create-education.dto";
import type { CreatePriorExperienceDto } from "./dto/create-prior-experience.dto";
import type { CreateSkillDto } from "./dto/create-skill.dto";

/**
 * v1 slice covering the "education and experience" and "certifications,
 * skills, languages" catalog items — flat add-only lists, no verification.
 */
@Injectable()
export class BackgroundService {
  constructor(
    private readonly repository: BackgroundRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly authRepository: AuthRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async getAll(employeeId: string) {
    const tenantId = await this.assertSelfOrAdmin(employeeId);
    return this.repository.findAll(tenantId, employeeId);
  }

  async addCertification(employeeId: string, dto: CreateCertificationDto) {
    const tenantId = await this.assertSelfOrAdmin(employeeId);
    return this.repository.createCertification(tenantId, employeeId, dto);
  }

  async addSkill(employeeId: string, dto: CreateSkillDto) {
    const tenantId = await this.assertSelfOrAdmin(employeeId);
    return this.repository.createSkill(tenantId, employeeId, dto);
  }

  async addEducation(employeeId: string, dto: CreateEducationDto) {
    const tenantId = await this.assertSelfOrAdmin(employeeId);
    return this.repository.createEducation(tenantId, employeeId, dto);
  }

  async addPriorExperience(employeeId: string, dto: CreatePriorExperienceDto) {
    const tenantId = await this.assertSelfOrAdmin(employeeId);
    return this.repository.createPriorExperience(tenantId, employeeId, dto);
  }

  private async assertSelfOrAdmin(employeeId: string): Promise<string> {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }
    const employee = await this.employeeRepository.findById(tenantId, employeeId);
    if (!employee) {
      throw new NotFoundAppError("OBJ-EMPLOYEE", "Employee not found.");
    }
    const user = await this.authRepository.findUserById(tenantId, userId);
    const isSelf = user?.employeeId === employeeId;
    const isAdmin = !!user?.roles.some((role) => role === "org_admin" || role === "hr_ops");
    if (!isSelf && !isAdmin) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }
    return tenantId;
  }
}
