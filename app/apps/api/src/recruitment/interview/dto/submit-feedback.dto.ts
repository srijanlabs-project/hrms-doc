import { IsIn, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

const RECOMMENDATIONS = ["StrongHire", "Hire", "NoHire", "StrongNoHire"] as const;

export class SubmitFeedbackDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsIn(RECOMMENDATIONS)
  recommendation!: (typeof RECOMMENDATIONS)[number];

  @IsOptional()
  @IsString()
  comments?: string;
}
