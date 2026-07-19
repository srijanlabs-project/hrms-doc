import { IsEmail, IsString, Length, Matches } from "class-validator";

export class RequestOtpDto {
  @IsString()
  @Matches(/^[a-z0-9-]{2,40}$/, { message: "tenantCode must be a lowercase slug" })
  tenantCode!: string;

  @IsEmail()
  @Length(3, 254)
  email!: string;
}
