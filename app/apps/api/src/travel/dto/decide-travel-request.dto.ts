import { IsOptional, IsString, Length } from "class-validator";

export class DecideTravelRequestDto {
  @IsOptional()
  @IsString()
  @Length(0, 500)
  note?: string;
}
