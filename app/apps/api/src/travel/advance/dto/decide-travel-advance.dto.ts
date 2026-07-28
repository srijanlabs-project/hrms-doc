import { IsOptional, IsPositive, IsString, Length } from "class-validator";

export class DecideTravelAdvanceDto {
  @IsOptional() @IsPositive() approvedAmount?: number;
  @IsOptional() @IsString() @Length(0, 500) note?: string;
}
