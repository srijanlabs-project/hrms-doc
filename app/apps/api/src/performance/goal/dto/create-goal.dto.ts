import { IsDateString, IsInt, IsOptional, IsString, Length, Max, Min } from "class-validator";

export class CreateGoalDto {
  @IsInt()
  @Min(2000)
  periodYear!: number;

  @IsString()
  @Length(2, 120)
  title!: string;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  weight?: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
