import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpsertSystemSettingDto {
  @IsString()
  @MaxLength(2000)
  value!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
