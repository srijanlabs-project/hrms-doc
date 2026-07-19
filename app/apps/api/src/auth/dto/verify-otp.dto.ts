import { IsEmail, IsString, Length, Matches } from "class-validator";

export class VerifyOtpDto {
  @IsString()
  @Matches(/^[a-z0-9-]{2,40}$/, { message: "tenantCode must be a lowercase slug" })
  tenantCode!: string;

  @IsEmail()
  @Length(3, 254)
  email!: string;

  @IsString()
  @Length(4, 10)
  otp!: string;
}
