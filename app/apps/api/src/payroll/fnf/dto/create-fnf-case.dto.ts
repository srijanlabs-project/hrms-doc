import { IsUUID } from "class-validator";

export class CreateFnfCaseDto {
  @IsUUID()
  employeeId!: string;
}
