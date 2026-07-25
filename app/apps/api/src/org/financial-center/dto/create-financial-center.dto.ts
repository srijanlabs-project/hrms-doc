import { IsIn, IsOptional, IsString, IsUUID, Length, Matches } from "class-validator";

const CENTER_TYPES = ["CostCenter", "ProfitCenter", "Project"] as const;

export class CreateFinancialCenterDto {
  @IsIn(CENTER_TYPES)
  centerType!: (typeof CENTER_TYPES)[number];

  @IsString()
  @Matches(/^[A-Z0-9_-]{2,20}$/, {
    message: "code must be 2-20 uppercase alphanumeric characters, - or _",
  })
  code!: string;

  @IsString()
  @Length(2, 120)
  name!: string;

  @IsOptional()
  @IsUUID()
  parentCenterId?: string;
}
