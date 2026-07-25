import { ArrayMinSize, IsArray } from "class-validator";

export interface SurveyAnswerInput {
  questionId: string;
  ratingValue?: number;
  textValue?: string;
}

export class SubmitSurveyResponseDto {
  /** Per-item shape validated in SurveyService.respond against the survey's own questions. */
  @IsArray()
  @ArrayMinSize(1)
  answers!: SurveyAnswerInput[];
}
