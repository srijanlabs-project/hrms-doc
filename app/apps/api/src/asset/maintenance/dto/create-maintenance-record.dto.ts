import { IsDateString, IsIn, IsNotEmpty, IsUUID } from "class-validator";

const MAINTENANCE_TYPES = ["Preventive", "Repair", "Inspection"] as const;

export class CreateMaintenanceRecordDto {
  @IsUUID() assetId!: string;
  @IsIn(MAINTENANCE_TYPES) maintenanceType!: (typeof MAINTENANCE_TYPES)[number];
  @IsNotEmpty() description!: string;
  @IsDateString() scheduledDate!: string;
}

export { MAINTENANCE_TYPES };
