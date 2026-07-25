import { IsDateString, IsIn, IsOptional, IsPositive, IsString, Length } from "class-validator";

const EXPENSE_CATEGORIES = ["Travel", "Lodging", "Meals", "Transport", "OfficeSupplies", "Other"] as const;

export class CreateExpenseClaimDto {
  @IsIn(EXPENSE_CATEGORIES)
  category!: (typeof EXPENSE_CATEGORIES)[number];

  @IsPositive()
  amount!: number;

  @IsDateString()
  expenseDate!: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  merchant?: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  businessPurpose?: string;
}
