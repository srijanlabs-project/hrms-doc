import { IsInt, IsISO8601, IsNotEmpty, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateLicenseDto {
  @IsNotEmpty() name!: string;
  @IsOptional() @IsString() vendor?: string;
  @IsInt() @IsPositive() totalSeats!: number;
  @IsOptional() @IsISO8601() expiryDate?: string;
}
