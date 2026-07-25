import { IsIn, IsNumber, IsOptional, IsPositive, IsString, Length } from "class-validator";

const LOAN_TYPES = ["Loan", "Advance"] as const;

export class CreateLoanAdvanceRequestDto {
  @IsIn(LOAN_TYPES)
  type!: (typeof LOAN_TYPES)[number];

  @IsNumber()
  @IsPositive()
  principal!: number;

  @IsNumber()
  @IsPositive()
  monthlyInstallment!: number;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  reason?: string;
}

export { LOAN_TYPES };
