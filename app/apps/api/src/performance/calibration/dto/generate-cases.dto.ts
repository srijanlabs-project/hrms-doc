import { IsOptional, IsUUID } from "class-validator";

export class GenerateCalibrationCasesDto {
  @IsOptional()
  @IsUUID()
  departmentId?: string;
}
