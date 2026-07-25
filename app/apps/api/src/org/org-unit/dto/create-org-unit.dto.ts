import { IsIn, IsOptional, IsString, IsUUID, Length, Matches } from "class-validator";

const UNIT_TYPES = [
  "BusinessUnit",
  "Division",
  "SectionTeam",
  "BranchOffice",
  "Region",
  "Zone",
  "Territory",
  "Campus",
  "Building",
  "Floor",
  "WorkArea",
  "Location",
] as const;

export class CreateOrgUnitDto {
  @IsIn(UNIT_TYPES)
  unitType!: (typeof UNIT_TYPES)[number];

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
  parentUnitId?: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  addressLine?: string;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  city?: string;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  state?: string;

  @IsOptional()
  @IsString()
  @Length(0, 80)
  country?: string;
}
