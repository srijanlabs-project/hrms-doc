import { IsEmail, IsString, Matches, MinLength } from "class-validator";

export class ProvisionTenantDto {
  @IsString()
  @MinLength(2)
  @Matches(/^[a-z0-9-]+$/, { message: "Tenant code must be lowercase letters, numbers, and hyphens only." })
  tenantCode!: string;

  @IsString()
  @MinLength(2)
  tenantName!: string;

  @IsEmail()
  adminEmail!: string;
}
