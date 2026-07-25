import { IsIn, IsNumber, IsPositive, IsString, IsUUID, Length } from "class-validator";

const PAY_TYPES = ["Bonus", "Incentive", "VariablePay"] as const;

export class CreateIncentiveBonusDto {
  @IsUUID()
  employeeId!: string;

  @IsIn(PAY_TYPES)
  payType!: (typeof PAY_TYPES)[number];

  @IsNumber()
  @IsPositive()
  amount!: number;

  @IsString()
  @Length(1, 500)
  reason!: string;
}

export { PAY_TYPES };
