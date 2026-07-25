import { Injectable } from "@nestjs/common";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, NotFoundAppError, ValidationAppError } from "../../platform/errors/errors";
import { QUESTION_TYPES, type CreateSurveyDto } from "./dto/create-survey.dto";
import type { SubmitSurveyResponseDto } from "./dto/submit-response.dto";
import { SurveyRepository } from "./survey.repository";

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-EXPERIENCE-001",
    code: "EXPERIENCE-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-SURVEY",
    details: { currentState },
  });
}

/**
 * v1 slice — see schema.prisma's Survey comment. Pulse surveys are just
 * Standard surveys with `type: "Pulse"`, not a separate mechanism.
 */
@Injectable()
export class SurveyService {
  constructor(
    private readonly repository: SurveyRepository,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
  ) {}

  /** org_admin/hr_ops only — see controller's @Roles guard. */
  async create(dto: CreateSurveyDto) {
    const { tenantId, userId } = this.requireAuthenticated();

    if (!dto.questions?.length) {
      throw new ValidationAppError([{ field: "questions", code: "REQUIRED", message: "At least one question is required." }]);
    }
    dto.questions.forEach((q, index) => {
      if (!q.text?.trim()) {
        throw new ValidationAppError([
          { field: `questions[${index}].text`, code: "REQUIRED", message: "Question text is required." },
        ]);
      }
      if (!QUESTION_TYPES.includes(q.type)) {
        throw new ValidationAppError([
          { field: `questions[${index}].type`, code: "INVALID", message: "Invalid question type." },
        ]);
      }
    });

    return this.repository.createWithQuestions(tenantId, {
      title: dto.title,
      description: dto.description,
      type: dto.type ?? "Standard",
      isAnonymous: dto.isAnonymous ?? false,
      createdByUserId: userId,
      questions: dto.questions.map((q, index) => ({ text: q.text, type: q.type, sortOrder: index })),
    });
  }

  /** org_admin/hr_ops only. */
  async listAllAdmin() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findAllForAdmin(tenantId);
  }

  /** Self-service: every published/closed survey, tagged with whether the caller has already responded. */
  async listMine() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const [surveys, responses] = await Promise.all([
      this.repository.findPublished(tenantId),
      this.repository.findResponsesForEmployee(tenantId, employee.id),
    ]);
    const respondedSurveyIds = new Set(responses.map((r) => r.surveyId));
    return surveys.map((survey) => ({ ...survey, hasResponded: respondedSurveyIds.has(survey.id) }));
  }

  async publish(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const survey = await this.repository.findById(tenantId, id);
    if (!survey) {
      throw new NotFoundAppError("OBJ-SURVEY", "Survey not found.");
    }
    if (survey.questions.length === 0) {
      throw stateConflict("A survey needs at least one question before it can be published.", survey.status);
    }
    const count = await this.repository.publish(tenantId, id);
    if (count === 0) {
      throw stateConflict("Only a Draft survey can be published.", survey.status);
    }
    return this.repository.findById(tenantId, id);
  }

  async close(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const survey = await this.repository.findById(tenantId, id);
    if (!survey) {
      throw new NotFoundAppError("OBJ-SURVEY", "Survey not found.");
    }
    const count = await this.repository.close(tenantId, id);
    if (count === 0) {
      throw stateConflict("Only a Published survey can be closed.", survey.status);
    }
    return this.repository.findById(tenantId, id);
  }

  async respond(id: string, dto: SubmitSurveyResponseDto) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const survey = await this.repository.findById(tenantId, id);
    if (!survey) {
      throw new NotFoundAppError("OBJ-SURVEY", "Survey not found.");
    }
    if (survey.status !== "Published") {
      throw stateConflict("This survey is not currently accepting responses.", survey.status);
    }

    const existing = await this.repository.findResponseByEmployee(tenantId, id, employee.id);
    if (existing) {
      throw stateConflict("You have already responded to this survey.", "Responded");
    }

    const questionIds = new Set(survey.questions.map((q) => q.id));
    const answeredIds = new Set(dto.answers.map((a) => a.questionId));
    if (questionIds.size !== answeredIds.size || [...questionIds].some((qid) => !answeredIds.has(qid))) {
      throw new ValidationAppError([
        { field: "answers", code: "MISMATCH", message: "Answers must cover exactly this survey's questions." },
      ]);
    }

    return this.repository.createResponse(tenantId, {
      surveyId: id,
      employeeId: employee.id,
      answers: dto.answers.map((a) => ({ questionId: a.questionId, ratingValue: a.ratingValue, textValue: a.textValue })),
    });
  }

  /** org_admin/hr_ops only. Never exposes employeeId when the survey is anonymous. */
  async getResults(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const survey = await this.repository.findById(tenantId, id);
    if (!survey) {
      throw new NotFoundAppError("OBJ-SURVEY", "Survey not found.");
    }
    const responses = await this.repository.findResponsesWithAnswers(tenantId, id);

    const questionResults = survey.questions.map((question) => {
      const answers = responses.flatMap((r) => r.answers.filter((a) => a.questionId === question.id));
      if (question.type === "Rating") {
        const ratings = answers.map((a) => a.ratingValue).filter((v): v is number => v != null);
        const average = ratings.length > 0 ? ratings.reduce((sum, v) => sum + v, 0) / ratings.length : null;
        return { questionId: question.id, text: question.text, type: question.type, averageRating: average, responseCount: ratings.length };
      }
      const textAnswers = answers.map((a) => a.textValue).filter((v): v is string => !!v);
      return { questionId: question.id, text: question.text, type: question.type, textAnswers };
    });

    return {
      surveyId: survey.id,
      title: survey.title,
      isAnonymous: survey.isAnonymous,
      responseCount: responses.length,
      questionResults,
    };
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
