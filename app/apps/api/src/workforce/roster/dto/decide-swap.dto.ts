import { IsOptional, IsString, Length } from "class-validator";

export class DecideSwapDto {
  @IsOptional()
  @IsString()
  @Length(0, 500)
  note?: string;
}
