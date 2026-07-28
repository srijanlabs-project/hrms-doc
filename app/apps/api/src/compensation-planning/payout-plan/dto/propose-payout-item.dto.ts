import { IsNumber, IsPositive, IsString, IsUUID, Length } from "class-validator";

export class ProposePayoutItemDto {
  @IsUUID()
  employeeId!: string;

  @IsNumber()
  @IsPositive()
  proposedAmount!: number;

  @IsString()
  @Length(1, 500)
  reason!: string;
}
