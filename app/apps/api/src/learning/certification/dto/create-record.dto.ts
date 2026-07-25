import { IsDateString, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateCertificationRecordDto {
  @IsUUID()
  certificationCatalogId!: string;

  /** Admin-only: records the certification for another employee instead of the caller. */
  @IsOptional()
  @IsUUID()
  employeeId?: string;

  @IsOptional()
  @IsString()
  certificateNumber?: string;

  @IsDateString()
  issueDate!: string;

  @IsOptional()
  @IsUUID()
  evidenceFileId?: string;
}
