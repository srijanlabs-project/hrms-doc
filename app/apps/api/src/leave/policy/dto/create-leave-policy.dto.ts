import { IsBoolean, IsIn, IsNumber, IsOptional, IsPositive, IsString, Length, Min } from "class-validator";

const LEAVE_TYPES = ["Annual", "Casual", "Sick", "Comp Off"] as const;

export class CreateLeavePolicyDto {
  @IsIn(LEAVE_TYPES)
  leaveType!: (typeof LEAVE_TYPES)[number];

  @IsString()
  @Length(2, 60)
  name!: string;

  @IsNumber()
  @IsPositive()
  annualDays!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  carryForwardCapDays?: number;

  @IsOptional()
  @IsBoolean()
  sandwichRuleEnabled?: boolean;
}
