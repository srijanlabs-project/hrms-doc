import { IsDateString, IsIn, IsOptional, IsString, IsUUID, Length } from "class-validator";

const CHANGE_TYPES = ["Transfer", "Promotion", "Demotion", "Deputation", "Confirmation", "Other"] as const;

export class CreateMovementDto {
  @IsIn(CHANGE_TYPES)
  changeType!: (typeof CHANGE_TYPES)[number];

  @IsDateString()
  effectiveDate!: string;

  @IsOptional()
  @IsUUID()
  toDepartmentId?: string;

  @IsOptional()
  @IsUUID()
  toManagerId?: string;

  @IsOptional()
  @IsUUID()
  toDesignationId?: string;

  @IsOptional()
  @IsUUID()
  toGradeId?: string;

  @IsOptional()
  @IsString()
  @Length(0, 300)
  reason?: string;
}
