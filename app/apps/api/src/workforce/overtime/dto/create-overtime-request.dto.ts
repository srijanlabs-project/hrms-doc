import { IsDateString, IsIn, IsOptional, IsPositive, IsString, Length, Max } from "class-validator";

const SETTLEMENT_TYPES = ["Payable", "CompOff"] as const;

export class CreateOvertimeRequestDto {
  @IsDateString()
  date!: string;

  @IsPositive()
  @Max(16)
  hoursRequested!: number;

  @IsOptional()
  @IsString()
  @Length(0, 300)
  reason?: string;

  @IsOptional()
  @IsIn(SETTLEMENT_TYPES)
  settlementType?: (typeof SETTLEMENT_TYPES)[number];
}

export { SETTLEMENT_TYPES };
