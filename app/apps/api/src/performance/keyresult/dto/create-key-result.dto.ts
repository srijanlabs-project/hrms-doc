import { IsNumber, IsOptional, IsPositive, IsString, IsUUID, Length } from "class-validator";

export class CreateKeyResultDto {
  @IsUUID()
  goalId!: string;

  @IsString()
  @Length(2, 160)
  title!: string;

  @IsNumber()
  @IsPositive()
  targetValue!: number;

  @IsOptional()
  @IsString()
  @Length(0, 20)
  unit?: string;
}
