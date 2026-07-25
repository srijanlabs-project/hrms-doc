import { IsUUID } from "class-validator";

export class AssignAssetDto {
  @IsUUID()
  assetId!: string;

  @IsUUID()
  employeeId!: string;
}
