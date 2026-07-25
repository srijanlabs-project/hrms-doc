import { IsDateString, IsNumber, IsPositive, IsUUID } from "class-validator";

export class CreateOfferDto {
  @IsUUID()
  applicationId!: string;

  @IsNumber()
  @IsPositive()
  monthlyBasic!: number;

  @IsDateString()
  joiningDate!: string;
}
