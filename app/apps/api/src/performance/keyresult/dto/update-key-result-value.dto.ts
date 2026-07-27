import { IsNumber, Min } from "class-validator";

export class UpdateKeyResultValueDto {
  @IsNumber()
  @Min(0)
  currentValue!: number;
}
