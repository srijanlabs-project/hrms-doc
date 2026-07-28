import { IsPositive } from "class-validator";

export class CreateTravelAdvanceDto {
  @IsPositive() requestedAmount!: number;
}
