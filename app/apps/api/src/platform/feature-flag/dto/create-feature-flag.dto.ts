import { IsBoolean, IsOptional, IsString, Length, Matches } from "class-validator";

export class CreateFeatureFlagDto {
  @IsString()
  @Matches(/^[a-z0-9._-]{2,80}$/, { message: "key must be a lowercase slug (letters, numbers, ., _, -)" })
  key!: string;

  @IsString()
  @Length(2, 120)
  name!: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
