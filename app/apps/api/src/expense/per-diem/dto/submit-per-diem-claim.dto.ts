import { IsInt, IsOptional, IsUUID, Min } from "class-validator";

export class SubmitPerDiemClaimDto {
  @IsUUID() policyId!: string;
  @IsInt() @Min(1) numberOfDays!: number;
  @IsOptional() @IsUUID() travelRequestId?: string;
}
