import { IsInt, IsUUID, Min } from "class-validator";

export class CreateAppraisalDto {
  @IsUUID()
  employeeId!: string;

  @IsInt()
  @Min(2000)
  periodYear!: number;
}
