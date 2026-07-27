import { IsDateString, IsOptional, IsString, IsUUID, Length } from "class-validator";

export class CreateBookingDto {
  @IsUUID()
  resourceId!: string;

  @IsDateString()
  bookingDate!: string;

  @IsOptional()
  @IsString()
  @Length(0, 300)
  notes?: string;
}
