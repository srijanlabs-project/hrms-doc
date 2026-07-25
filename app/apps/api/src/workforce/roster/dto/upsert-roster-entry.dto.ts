import { IsDateString, IsUUID } from "class-validator";

export class UpsertRosterEntryDto {
  @IsUUID()
  employeeId!: string;

  @IsUUID()
  shiftId!: string;

  @IsDateString()
  date!: string;
}
