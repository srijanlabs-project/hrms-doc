import { IsIn, IsString } from "class-validator";

export class RevealSensitiveFieldDto {
  @IsIn(["IdentityDocument", "BankAccount"])
  recordType!: "IdentityDocument" | "BankAccount";

  @IsString()
  recordId!: string;
}
