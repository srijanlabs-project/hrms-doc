import { IsIn, IsNumber, IsPositive, IsString, Length } from "class-validator";

const LEAVE_TYPES = ["Annual", "Casual", "Sick"] as const;

export class CreateLeavePolicyDto {
  @IsIn(LEAVE_TYPES)
  leaveType!: (typeof LEAVE_TYPES)[number];

  @IsString()
  @Length(2, 60)
  name!: string;

  @IsNumber()
  @IsPositive()
  annualDays!: number;
}
