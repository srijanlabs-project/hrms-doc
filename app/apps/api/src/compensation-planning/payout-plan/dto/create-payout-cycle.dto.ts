import { IsIn, IsInt, IsString, Length, Min } from "class-validator";

const PAYOUT_TYPES = ["Bonus", "Incentive"] as const;

export class CreatePayoutCycleDto {
  @IsInt()
  @Min(2000)
  periodYear!: number;

  @IsString()
  @Length(2, 160)
  label!: string;

  @IsIn(PAYOUT_TYPES)
  payType!: (typeof PAYOUT_TYPES)[number];
}

export { PAYOUT_TYPES };
