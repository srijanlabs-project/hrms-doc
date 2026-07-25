import { IsOptional, IsString, IsUUID, Length } from "class-validator";

export class RequestSwapDto {
  @IsUUID()
  counterpartEmployeeId!: string;

  @IsOptional()
  @IsString()
  @Length(0, 300)
  reason?: string;
}
