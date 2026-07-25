import { IsDateString, IsIn, IsOptional, IsString, Length } from "class-validator";

const LEAVE_TYPES = ["Annual", "Casual", "Sick", "Comp Off"] as const;

export class CreateLeaveRequestDto {
  @IsIn(LEAVE_TYPES)
  leaveType!: (typeof LEAVE_TYPES)[number];

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  reason?: string;
}
