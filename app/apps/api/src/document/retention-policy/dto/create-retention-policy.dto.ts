import { IsIn, IsInt, IsOptional, IsString, Length, Min } from "class-validator";

const CATEGORIES = ["All", "Policy", "Contract", "Certificate", "Form", "Report", "Other"] as const;

export class CreateRetentionPolicyDto {
  @IsString()
  @Length(1, 120)
  name!: string;

  @IsOptional()
  @IsIn(CATEGORIES)
  category?: (typeof CATEGORIES)[number];

  @IsInt()
  @Min(1)
  retentionMonths!: number;
}
