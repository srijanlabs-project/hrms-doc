import { IsInt, Max, Min } from "class-validator";

export class GenerateTestDataDto {
  @IsInt() @Min(1) @Max(50) count!: number;
}
