import { IsNumber, IsOptional, IsString, Length, Min } from "class-validator";

export class CreateEncashmentRequestDto {
  @IsString()
  @Length(1, 40)
  leaveType!: string;

  @IsNumber()
  @Min(0.5)
  days!: number;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  reason?: string;
}
