import { IsEmail, IsOptional, IsString, Length } from "class-validator";

export class CreateVendorDto {
  @IsString()
  @Length(1, 150)
  name!: string;

  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  @Length(0, 30)
  contactPhone?: string;
}
