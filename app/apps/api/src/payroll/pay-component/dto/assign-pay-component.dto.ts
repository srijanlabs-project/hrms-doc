import { IsNumber, IsOptional, IsUUID } from "class-validator";

export class AssignPayComponentDto {
  @IsUUID()
  employeeId!: string;

  @IsUUID()
  payComponentId!: string;

  /** Overrides the component's defaultValue when set. */
  @IsOptional()
  @IsNumber()
  value?: number;
}
