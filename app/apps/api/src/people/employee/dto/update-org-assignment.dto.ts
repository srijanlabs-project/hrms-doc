import { IsIn, IsOptional, IsUUID } from "class-validator";

const WORKER_TYPES = ["Permanent", "FixedTerm", "Contractor", "Intern", "Consultant"] as const;

/** Wave 1 Org Management deepening: direct field-level assignment, no promotion/transfer workflow or approval chain. */
export class UpdateOrgAssignmentDto {
  @IsOptional()
  @IsUUID()
  positionId?: string;

  @IsOptional()
  @IsUUID()
  gradeId?: string;

  @IsOptional()
  @IsUUID()
  financialCenterId?: string;

  @IsOptional()
  @IsIn(WORKER_TYPES)
  workerType?: (typeof WORKER_TYPES)[number];
}
