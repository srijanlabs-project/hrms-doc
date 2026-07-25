import { IsBoolean, IsIn, IsOptional, IsString } from "class-validator";

const READINESS_LEVELS = ["ReadyNow", "Ready1Year", "Ready2Years", "Unknown"] as const;

export class UpdateSuccessorDto {
  @IsOptional()
  @IsIn(READINESS_LEVELS)
  readiness?: (typeof READINESS_LEVELS)[number];

  @IsOptional()
  @IsBoolean()
  isEmergency?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}
