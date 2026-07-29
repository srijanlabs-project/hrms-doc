import { IsOptional, IsString, Length } from "class-validator";

export class CompleteMaintenanceRecordDto {
  @IsOptional() @IsString() @Length(0, 500) notes?: string;
}
