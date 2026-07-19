import { IsEmail, IsString, Length, Matches } from "class-validator";

export class LoginDto {
  @IsString()
  @Matches(/^[a-z0-9-]{2,40}$/, { message: "tenantCode must be a lowercase slug" })
  tenantCode!: string;

  @IsEmail()
  @Length(3, 254)
  email!: string;

  @IsString()
  @Length(1, 200)
  password!: string;
}
