import { IsEmail, IsString, IsUUID, Length } from "class-validator";

export class SubmitReferralDto {
  @IsUUID()
  requisitionId!: string;

  @IsString()
  @Length(2, 120)
  fullName!: string;

  @IsEmail()
  email!: string;
}
