import { IsIn, IsOptional, IsString, Length } from "class-validator";

const OUTCOMES = ["Completed", "Extended", "Failed"] as const;

export class ClosePipDto {
  @IsIn(OUTCOMES)
  outcome!: (typeof OUTCOMES)[number];

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  outcomeNotes?: string;
}

export { OUTCOMES };
