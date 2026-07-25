import { IsOptional, IsString, Length } from "class-validator";

export class DecideTimesheetEntryDto {
  @IsOptional()
  @IsString()
  @Length(0, 500)
  note?: string;
}
