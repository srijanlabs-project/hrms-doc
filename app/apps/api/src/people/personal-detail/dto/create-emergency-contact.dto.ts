import { IsBoolean, IsOptional, IsString, Length } from "class-validator";

export class CreateEmergencyContactDto {
  @IsString()
  @Length(1, 120)
  name!: string;

  @IsString()
  @Length(1, 60)
  relationship!: string;

  @IsString()
  @Length(1, 20)
  phone!: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
