import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateAccessReviewCycleDto {
  @IsString()
  @MinLength(1)
  @MaxLength(40)
  periodLabel!: string;
}
