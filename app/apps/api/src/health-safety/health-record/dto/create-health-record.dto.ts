import { IsDateString, IsIn, IsOptional, IsString, IsUUID, Length } from "class-validator";

const RECORD_TYPES = ["MedicalCheckup", "Vaccination", "OccupationalHealthReview"] as const;

export class CreateHealthRecordDto {
  @IsOptional()
  @IsUUID()
  employeeId?: string;

  @IsIn(RECORD_TYPES)
  type!: (typeof RECORD_TYPES)[number];

  @IsDateString()
  recordDate!: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  provider?: string;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  notes?: string;

  @IsOptional()
  @IsDateString()
  nextDueDate?: string;

  @IsOptional()
  @IsUUID()
  evidenceFileId?: string;
}
