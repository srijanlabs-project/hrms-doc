import { IsDateString, IsUUID } from "class-validator";

export class GenerateRosterDto {
  @IsUUID()
  employeeId!: string;

  @IsDateString()
  from!: string;

  @IsDateString()
  to!: string;
}
