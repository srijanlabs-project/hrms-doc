import { IsArray, IsIn, IsObject, IsOptional, IsString } from "class-validator";
import { REPORTABLE_ENTITY_TYPES } from "../field-registry";

export class RunReportDto {
  @IsIn(REPORTABLE_ENTITY_TYPES)
  entityType!: (typeof REPORTABLE_ENTITY_TYPES)[number];

  @IsArray()
  @IsString({ each: true })
  selectedFields!: string[];

  @IsOptional()
  @IsObject()
  filters?: Record<string, string | number | boolean>;
}
