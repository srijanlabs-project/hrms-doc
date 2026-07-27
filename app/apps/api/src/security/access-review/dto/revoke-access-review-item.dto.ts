import { IsOptional, IsString, MaxLength } from "class-validator";

export class RevokeAccessReviewItemDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
