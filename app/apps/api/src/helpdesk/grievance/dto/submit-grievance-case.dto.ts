import { IsIn, IsNotEmpty } from "class-validator";

const CASE_TYPES = ["Grievance", "Harassment", "Discrimination", "PolicyViolation", "Other"] as const;

export class SubmitGrievanceCaseDto {
  @IsIn(CASE_TYPES) caseType!: (typeof CASE_TYPES)[number];
  @IsNotEmpty() subject!: string;
  @IsNotEmpty() description!: string;
}

export { CASE_TYPES as GRIEVANCE_CASE_TYPES };
