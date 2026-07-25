import { IsBoolean, IsInt, IsOptional, IsString, Length, Min } from "class-validator";

export class CreateCourseDto {
  @IsString()
  @Length(2, 160)
  title!: string;

  @IsOptional()
  @IsString()
  @Length(0, 2000)
  description?: string;

  @IsInt()
  @Min(1)
  durationHours!: number;

  @IsOptional()
  @IsBoolean()
  isMandatory?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  recurrenceMonths?: number;
}
