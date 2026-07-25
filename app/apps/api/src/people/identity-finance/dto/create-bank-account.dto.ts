import { IsBoolean, IsOptional, IsString, Length } from "class-validator";

export class CreateBankAccountDto {
  @IsString()
  @Length(1, 120)
  accountHolderName!: string;

  @IsString()
  @Length(4, 30)
  accountNumber!: string;

  @IsOptional()
  @IsString()
  @Length(0, 20)
  ifscCode?: string;

  @IsString()
  @Length(1, 120)
  bankName!: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  branchName?: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
