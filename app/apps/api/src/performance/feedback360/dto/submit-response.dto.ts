import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class SubmitFeedback360ResponseDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsOptional()
  @IsString()
  strengths?: string;

  @IsOptional()
  @IsString()
  developmentAreas?: string;
}
