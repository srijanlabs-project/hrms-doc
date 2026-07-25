import { IsDateString, IsUUID } from "class-validator";

export class AssignRotationDto {
  @IsUUID()
  employeeId!: string;

  @IsUUID()
  patternId!: string;

  /** Must be a Monday — week 0 of the pattern starts here. */
  @IsDateString()
  anchorWeekStart!: string;
}
