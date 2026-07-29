import { IsBoolean, IsOptional, IsString, Length } from "class-validator";

export class UpsertPersonalDetailDto {
  @IsOptional()
  @IsString()
  @Length(0, 40)
  maritalStatus?: string;

  @IsOptional()
  @IsString()
  @Length(0, 30)
  gender?: string;

  @IsOptional()
  @IsString()
  @Length(0, 10)
  bloodGroup?: string;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  nationality?: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  currentAddressLine?: string;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  currentCity?: string;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  currentState?: string;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  currentCountry?: string;

  @IsOptional()
  @IsString()
  @Length(0, 20)
  currentPincode?: string;

  @IsOptional()
  @IsBoolean()
  permanentSameAsCurrent?: boolean;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  permanentAddressLine?: string;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  permanentCity?: string;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  permanentState?: string;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  permanentCountry?: string;

  @IsOptional()
  @IsString()
  @Length(0, 20)
  permanentPincode?: string;

  @IsOptional()
  @IsString()
  @Length(0, 300)
  allergies?: string;

  @IsOptional()
  @IsString()
  @Length(0, 300)
  medicalConditions?: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  physicianName?: string;

  @IsOptional()
  @IsString()
  @Length(0, 30)
  physicianPhone?: string;
}
