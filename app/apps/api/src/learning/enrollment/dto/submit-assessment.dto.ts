import { IsNumber, Min } from "class-validator";

export class SubmitAssessmentDto {
  @IsNumber()
  @Min(0)
  score!: number;

  @IsNumber()
  @Min(1)
  maxScore!: number;
}
