import { ArrayMaxSize, IsArray, IsInt, IsOptional, IsString, IsUUID, Length, Max, Min } from "class-validator";

export class CreateCareerPlanDto {
  @IsOptional()
  @IsUUID()
  targetDesignationId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(30)
  timeframeYears?: number;

  @IsString()
  @Length(1, 2000)
  developmentNotes!: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  actions?: string[];
}
