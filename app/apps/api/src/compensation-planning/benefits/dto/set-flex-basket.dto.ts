import { IsNumber, Min } from "class-validator";

export class SetFlexBasketDto {
  @IsNumber()
  @Min(0)
  annualAmount!: number;
}
