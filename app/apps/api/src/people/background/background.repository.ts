import { Injectable } from "@nestjs/common";
import type { EducationRecord, EmployeeCertification, EmployeeSkill, PriorExperience } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";
import type { CreateCertificationDto } from "./dto/create-certification.dto";
import type { CreateEducationDto } from "./dto/create-education.dto";
import type { CreatePriorExperienceDto } from "./dto/create-prior-experience.dto";
import type { CreateSkillDto } from "./dto/create-skill.dto";

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class BackgroundRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(tenantId: string, employeeId: string) {
    return this.prisma.withTenant(tenantId, async (tx) => {
      const [certifications, skills, education, priorExperience] = await Promise.all([
        tx.employeeCertification.findMany({ where: { tenantId, employeeId }, orderBy: { createdAt: "desc" } }),
        tx.employeeSkill.findMany({ where: { tenantId, employeeId }, orderBy: { createdAt: "desc" } }),
        tx.educationRecord.findMany({ where: { tenantId, employeeId }, orderBy: { startYear: "desc" } }),
        tx.priorExperience.findMany({ where: { tenantId, employeeId }, orderBy: { startDate: "desc" } }),
      ]);
      return { certifications, skills, education, priorExperience };
    });
  }

  createCertification(tenantId: string, employeeId: string, dto: CreateCertificationDto): Promise<EmployeeCertification> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.employeeCertification.create({
        data: {
          tenantId,
          employeeId,
          name: dto.name,
          issuingOrganization: dto.issuingOrganization,
          issueDate: dto.issueDate ? new Date(dto.issueDate) : undefined,
          expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
          credentialId: dto.credentialId,
        },
      }),
    );
  }

  createSkill(tenantId: string, employeeId: string, dto: CreateSkillDto): Promise<EmployeeSkill> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.employeeSkill.create({
        data: { tenantId, employeeId, skillType: dto.skillType, name: dto.name, proficiencyLevel: dto.proficiencyLevel },
      }),
    );
  }

  createEducation(tenantId: string, employeeId: string, dto: CreateEducationDto): Promise<EducationRecord> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.educationRecord.create({ data: { tenantId, employeeId, ...dto } }),
    );
  }

  createPriorExperience(
    tenantId: string,
    employeeId: string,
    dto: CreatePriorExperienceDto,
  ): Promise<PriorExperience> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.priorExperience.create({
        data: {
          tenantId,
          employeeId,
          companyName: dto.companyName,
          title: dto.title,
          startDate: dto.startDate ? new Date(dto.startDate) : undefined,
          endDate: dto.endDate ? new Date(dto.endDate) : undefined,
          reasonForLeaving: dto.reasonForLeaving,
        },
      }),
    );
  }
}
