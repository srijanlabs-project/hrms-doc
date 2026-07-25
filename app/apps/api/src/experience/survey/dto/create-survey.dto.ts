import { ArrayMinSize, IsArray, IsBoolean, IsIn, IsOptional, IsString, Length } from "class-validator";

const SURVEY_TYPES = ["Standard", "Pulse"] as const;
const QUESTION_TYPES = ["Rating", "Text"] as const;

export interface SurveyQuestionInput {
  text: string;
  type: (typeof QUESTION_TYPES)[number];
}

export class CreateSurveyDto {
  @IsString()
  @Length(1, 150)
  title!: string;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  description?: string;

  @IsOptional()
  @IsIn(SURVEY_TYPES)
  type?: (typeof SURVEY_TYPES)[number];

  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;

  /** Per-item shape (text/type) validated in SurveyService.create, not here — no nested-DTO pattern used elsewhere in this codebase. */
  @IsArray()
  @ArrayMinSize(1)
  questions!: SurveyQuestionInput[];
}

export { QUESTION_TYPES };
