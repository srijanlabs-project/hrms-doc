import { IsOptional, IsString, IsUUID, Length } from "class-validator";

export class CompleteTaskDto {
  @IsOptional()
  @IsString()
  @Length(0, 500)
  note?: string;

  @IsOptional()
  @IsUUID()
  evidenceFileId?: string;
}
