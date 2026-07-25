import { IsInt, Min } from "class-validator";

export class RunCarryForwardDto {
  /** The year whose unused balance is being carried into fromYear + 1. */
  @IsInt()
  @Min(2000)
  fromYear!: number;
}
