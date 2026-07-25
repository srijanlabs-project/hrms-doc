import { IsInt, Min } from "class-validator";

export class CreateCycleDto {
  @IsInt()
  @Min(2000)
  periodYear!: number;
}
