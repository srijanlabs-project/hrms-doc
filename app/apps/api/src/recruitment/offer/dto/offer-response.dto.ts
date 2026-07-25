import { IsBoolean, IsOptional, IsString, Length } from "class-validator";

export class OfferResponseDto {
  @IsBoolean()
  accepted!: boolean;

  @IsOptional()
  @IsString()
  @Length(0, 300)
  declineReason?: string;
}
