import { IsDateString, IsEmail, IsIn, IsOptional, IsString, IsUUID, Length } from "class-validator";

const CATEGORIES = ["Contractor", "Consultant", "AgencyStaff", "Intern"] as const;

export class CreateWorkerDto {
  @IsUUID()
  vendorId!: string;

  @IsString()
  @Length(1, 150)
  fullName!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsIn(CATEGORIES)
  category?: (typeof CATEGORIES)[number];

  @IsDateString()
  contractStartDate!: string;

  @IsDateString()
  contractEndDate!: string;

  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @IsOptional()
  @IsString()
  @Length(0, 150)
  workLocation?: string;
}

export { CATEGORIES };
