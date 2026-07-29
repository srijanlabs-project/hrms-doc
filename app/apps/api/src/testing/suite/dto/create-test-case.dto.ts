import { IsNotEmpty } from "class-validator";

export class CreateTestCaseDto {
  @IsNotEmpty() title!: string;
  @IsNotEmpty() steps!: string;
  @IsNotEmpty() expectedResult!: string;
}
