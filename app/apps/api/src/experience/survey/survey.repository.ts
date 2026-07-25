import { Injectable } from "@nestjs/common";
import type { Prisma, Survey, SurveyAnswer, SurveyQuestion, SurveyResponse } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type SurveyWithQuestions = Survey & { questions: SurveyQuestion[] };
export type SurveyResponseWithAnswers = SurveyResponse & { answers: SurveyAnswer[] };

const includeQuestions = {
  questions: { orderBy: { sortOrder: "asc" } },
} satisfies Prisma.SurveyInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class SurveyRepository {
  constructor(private readonly prisma: PrismaService) {}

  createWithQuestions(
    tenantId: string,
    data: {
      title: string;
      description?: string;
      type: string;
      isAnonymous: boolean;
      createdByUserId: string;
      questions: { text: string; type: string; sortOrder: number }[];
    },
  ): Promise<SurveyWithQuestions> {
    const { questions, ...surveyData } = data;
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.survey.create({
        data: {
          ...surveyData,
          tenantId,
          questions: { create: questions.map((q) => ({ ...q, tenantId })) },
        },
        include: includeQuestions,
      }),
    );
  }

  findById(tenantId: string, id: string): Promise<SurveyWithQuestions | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.survey.findFirst({ where: { id, tenantId }, include: includeQuestions }),
    );
  }

  findAllForAdmin(tenantId: string): Promise<SurveyWithQuestions[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.survey.findMany({ where: { tenantId }, include: includeQuestions, orderBy: { createdAt: "desc" } }),
    );
  }

  findPublished(tenantId: string): Promise<SurveyWithQuestions[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.survey.findMany({
        where: { tenantId, status: { in: ["Published", "Closed"] } },
        include: includeQuestions,
        orderBy: { createdAt: "desc" },
      }),
    );
  }

  async publish(tenantId: string, id: string): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.survey.updateMany({
        where: { id, tenantId, status: "Draft" },
        data: { status: "Published", publishedAt: new Date() },
      }),
    );
    return result.count;
  }

  async close(tenantId: string, id: string): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.survey.updateMany({
        where: { id, tenantId, status: "Published" },
        data: { status: "Closed", closedAt: new Date() },
      }),
    );
    return result.count;
  }

  findResponseByEmployee(tenantId: string, surveyId: string, employeeId: string): Promise<SurveyResponse | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.surveyResponse.findFirst({ where: { tenantId, surveyId, employeeId } }),
    );
  }

  findResponsesForEmployee(tenantId: string, employeeId: string): Promise<SurveyResponse[]> {
    return this.prisma.withTenant(tenantId, (tx) => tx.surveyResponse.findMany({ where: { tenantId, employeeId } }));
  }

  createResponse(
    tenantId: string,
    data: {
      surveyId: string;
      employeeId: string;
      answers: { questionId: string; ratingValue?: number; textValue?: string }[];
    },
  ): Promise<SurveyResponseWithAnswers> {
    const { answers, ...responseData } = data;
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.surveyResponse.create({
        data: {
          ...responseData,
          tenantId,
          answers: { create: answers.map((a) => ({ ...a, tenantId })) },
        },
        include: { answers: true },
      }),
    );
  }

  findResponsesWithAnswers(tenantId: string, surveyId: string): Promise<SurveyResponseWithAnswers[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.surveyResponse.findMany({ where: { tenantId, surveyId }, include: { answers: true } }),
    );
  }
}
