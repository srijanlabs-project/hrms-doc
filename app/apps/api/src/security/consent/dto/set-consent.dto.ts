import { IsIn, IsOptional, IsString, MaxLength } from "class-validator";

export class SetConsentDto {
  @IsIn(["Granted", "Revoked"])
  status!: "Granted" | "Revoked";

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
