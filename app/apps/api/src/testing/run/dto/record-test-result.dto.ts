import { IsIn, IsOptional, IsString, IsUUID, Length } from "class-validator";

const OUTCOMES = ["Pass", "Fail", "Blocked"] as const;

export class RecordTestResultDto {
  @IsUUID() caseId!: string;
  @IsIn(OUTCOMES) outcome!: (typeof OUTCOMES)[number];
  @IsOptional() @IsString() @Length(0, 1000) notes?: string;
}
