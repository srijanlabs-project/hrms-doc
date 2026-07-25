import { IsDateString, IsPositive, IsString, Length, Max } from "class-validator";

export class CreateTimesheetEntryDto {
  @IsDateString()
  date!: string;

  @IsPositive()
  @Max(24)
  hours!: number;

  @IsString()
  @Length(1, 120)
  activity!: string;
}
