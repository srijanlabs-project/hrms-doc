import { IsDateString, IsIn, IsOptional, IsString, Length } from "class-validator";

const DECISIONS = ["Confirmed", "Failed", "Extended"] as const;

export class DecideProbationDto {
  @IsIn(DECISIONS)
  decision!: (typeof DECISIONS)[number];

  @IsOptional()
  @IsDateString()
  extendedUntil?: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  decisionNote?: string;
}
