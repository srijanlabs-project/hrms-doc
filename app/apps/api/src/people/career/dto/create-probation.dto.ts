import { IsDateString } from "class-validator";

export class CreateProbationDto {
  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;
}
