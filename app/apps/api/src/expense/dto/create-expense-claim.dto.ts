import { IsDateString, IsIn, IsOptional, IsPositive, IsString, IsUUID, Length } from "class-validator";

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

  /** Wave 3 W4·E16 gap closure ("travel expense settlement") — links this claim to a trip. */
  @IsOptional()
  @IsUUID()
  travelRequestId?: string;

  /** Wave 3 W4·E17 gap closure ("receipts") — id of a StoredFile already uploaded via POST /files. */
  @IsOptional()
  @IsUUID()
  receiptFileId?: string;
}
