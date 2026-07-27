import { IsDateString, IsEmail, IsOptional, IsString, Length } from "class-validator";

export class CreateVisitorDto {
  @IsString()
  @Length(1, 120)
  fullName!: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  company?: string;

  @IsOptional()
  @IsString()
  @Length(0, 30)
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Length(0, 300)
  purpose?: string;

  @IsDateString()
  scheduledAt!: string;
}
