import { IsInt, IsNumber, Max, Min } from "class-validator";

export class SetDepartmentBudgetDto {
  @IsInt()
  @Min(2000)
  @Max(2100)
  periodYear!: number;

  @IsNumber()
  @Min(0)
  allocatedAmount!: number;
}
