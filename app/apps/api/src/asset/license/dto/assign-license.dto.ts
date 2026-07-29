import { IsUUID } from "class-validator";

export class AssignLicenseDto {
  @IsUUID() licenseId!: string;
  @IsUUID() employeeId!: string;
}
