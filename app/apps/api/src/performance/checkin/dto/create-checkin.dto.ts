import { IsDateString, IsOptional, IsString, IsUUID, Length } from "class-validator";

export class CreateCheckInDto {
  @IsUUID()
  employeeId!: string;

  @IsDateString()
  scheduledDate!: string;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  agenda?: string;
}
