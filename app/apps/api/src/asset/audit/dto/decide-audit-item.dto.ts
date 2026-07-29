import { IsOptional, IsString, Length } from "class-validator";

export class DecideAuditItemDto {
  @IsOptional() @IsString() @Length(0, 500) notes?: string;
}
