import { IsDateString, IsUUID } from "class-validator";

export class AssignFlexPolicyDto {
  @IsUUID()
  employeeId!: string;

  @IsUUID()
  policyId!: string;

  @IsDateString()
  effectiveFrom!: string;
}
