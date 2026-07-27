import { IsArray, IsBoolean, IsIn, IsOptional } from "class-validator";
import { IMPORTABLE_ENTITY_TYPES } from "../import-engine.service";

export class CreateImportBatchDto {
  @IsIn(IMPORTABLE_ENTITY_TYPES)
  entityType!: (typeof IMPORTABLE_ENTITY_TYPES)[number];

  @IsArray()
  rows!: Record<string, unknown>[];

  @IsOptional()
  @IsBoolean()
  dryRun?: boolean;
}
