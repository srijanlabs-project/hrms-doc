import { IsDateString, IsIn, IsOptional, IsString, Length } from "class-validator";

const SEVERITIES = ["Low", "Medium", "High", "Critical"] as const;

export class CreateSafetyIncidentDto {
  @IsDateString()
  incidentDate!: string;

  @IsString()
  @Length(1, 200)
  location!: string;

  @IsString()
  @Length(1, 2000)
  description!: string;

  @IsOptional()
  @IsIn(SEVERITIES)
  severity?: (typeof SEVERITIES)[number];
}
