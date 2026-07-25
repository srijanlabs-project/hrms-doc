import { IsDateString, IsIn, IsOptional, IsString, IsUUID, Length } from "class-validator";

const CHANGE_TYPES = ["Transfer", "Promotion", "Demotion"] as const;

export class CreateTransferPromotionRequestDto {
  @IsUUID()
  employeeId!: string;

  @IsIn(CHANGE_TYPES)
  changeType!: (typeof CHANGE_TYPES)[number];

  @IsOptional()
  @IsUUID()
  toDepartmentId?: string;

  @IsOptional()
  @IsUUID()
  toDesignationId?: string;

  @IsOptional()
  @IsUUID()
  toGradeId?: string;

  @IsDateString()
  effectiveDate!: string;

  @IsString()
  @Length(1, 500)
  reason!: string;
}

export { CHANGE_TYPES };
