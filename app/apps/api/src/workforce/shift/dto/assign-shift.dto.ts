import { IsDateString, IsUUID } from "class-validator";

export class AssignShiftDto {
  @IsUUID()
  employeeId!: string;

  @IsUUID()
  shiftId!: string;

  @IsDateString()
  effectiveFrom!: string;
}
