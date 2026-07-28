import { IsDateString, IsIn, IsInt, IsOptional, IsString, Length, Min } from "class-validator";

const MODES = ["Flight", "Train", "Bus", "Car", "Hotel", "Other"] as const;

export class CreateItinerarySegmentDto {
  @IsInt() @Min(1) sequence!: number;
  @IsIn(MODES) mode!: (typeof MODES)[number];
  @IsString() @Length(1, 120) fromLocation!: string;
  @IsString() @Length(1, 120) toLocation!: string;
  @IsDateString() departAt!: string;
  @IsOptional() @IsDateString() arriveAt?: string;
  @IsOptional() @IsString() @Length(0, 120) bookingReference?: string;
  @IsOptional() @IsString() @Length(0, 500) notes?: string;
}

export { MODES as ITINERARY_MODES };
