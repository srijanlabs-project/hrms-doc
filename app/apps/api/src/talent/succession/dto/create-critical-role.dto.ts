import { IsIn, IsOptional, IsString, IsUUID, Length } from "class-validator";

const CRITICALITY_TIERS = ["High", "Medium", "Low"] as const;

export class CreateCriticalRoleDto {
  @IsString()
  @Length(2, 160)
  title!: string;

  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @IsOptional()
  @IsUUID()
  incumbentEmployeeId?: string;

  @IsOptional()
  @IsIn(CRITICALITY_TIERS)
  criticalityTier?: (typeof CRITICALITY_TIERS)[number];
}
