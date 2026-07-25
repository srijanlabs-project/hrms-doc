import { IsDateString, IsNumber, IsPositive, IsUUID } from "class-validator";

export class SetCompensationDto {
  @IsUUID()
  employeeId!: string;

  @IsNumber()
  @IsPositive()
  monthlyBasic!: number;

  @IsDateString()
  effectiveFrom!: string;
}
