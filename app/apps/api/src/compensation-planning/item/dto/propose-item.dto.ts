import { IsPositive, IsUUID } from "class-validator";

export class ProposeItemDto {
  @IsUUID()
  employeeId!: string;

  @IsPositive()
  proposedMonthlyBasic!: number;
}
