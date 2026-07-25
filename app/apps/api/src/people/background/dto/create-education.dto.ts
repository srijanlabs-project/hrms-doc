import { IsInt, IsOptional, IsString, Length, Max, Min } from "class-validator";

export class CreateEducationDto {
  @IsString()
  @Length(1, 120)
  degree!: string;

  @IsString()
  @Length(1, 160)
  institution!: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  fieldOfStudy?: string;

  @IsOptional()
  @IsInt()
  @Min(1950)
  @Max(2100)
  startYear?: number;

  @IsOptional()
  @IsInt()
  @Min(1950)
  @Max(2100)
  endYear?: number;

  @IsOptional()
  @IsString()
  @Length(0, 40)
  grade?: string;
}
