import { IsIn, IsInt, IsNumber, IsOptional, IsString, IsUUID, Length, Min } from "class-validator";

const LEAVE_TYPES = ["Annual", "Casual", "Sick"] as const;

export class CreateAdjustmentDto {
  @IsUUID()
  employeeId!: string;

  @IsIn(LEAVE_TYPES)
  leaveType!: (typeof LEAVE_TYPES)[number];

  /** Signed — positive credits the balance, negative debits it. */
  @IsNumber()
  amountDays!: number;

  @IsOptional()
  @IsInt()
  @Min(2000)
  periodYear?: number;

  @IsString()
  @Length(2, 300)
  reason!: string;
}
