import { IsOptional, IsString, Length } from "class-validator";

export class RejectApplicationDto {
  @IsOptional()
  @IsString()
  @Length(0, 300)
  reason?: string;
}
