import { IsOptional, IsString, Length } from "class-validator";

export class DecideRedemptionDto {
  @IsOptional() @IsString() @Length(0, 500) decisionNote?: string;
}
