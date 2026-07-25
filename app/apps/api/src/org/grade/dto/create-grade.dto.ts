import { IsOptional, IsPositive, IsString, Length, Matches } from "class-validator";

export class CreateGradeDto {
  @IsString()
  @Matches(/^[A-Z0-9_-]{2,20}$/, {
    message: "code must be 2-20 uppercase alphanumeric characters, - or _",
  })
  code!: string;

  @IsString()
  @Length(2, 120)
  name!: string;

  @IsOptional()
  @IsString()
  @Length(0, 40)
  band?: string;

  @IsOptional()
  @IsPositive()
  minCompensation?: number;

  @IsOptional()
  @IsPositive()
  maxCompensation?: number;
}
