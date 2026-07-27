import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

export class UpdateNumberSeriesDto {
  @IsOptional()
  @IsString()
  @MaxLength(20)
  prefix?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  padding?: number;
}
