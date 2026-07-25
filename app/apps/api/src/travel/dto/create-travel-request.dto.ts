import { IsDateString, IsIn, IsOptional, IsPositive, IsString, Length } from "class-validator";

const TRIP_TYPES = ["Business", "Training", "ClientVisit", "Relocation", "Emergency"] as const;

export class CreateTravelRequestDto {
  @IsIn(TRIP_TYPES)
  tripType!: (typeof TRIP_TYPES)[number];

  @IsString()
  @Length(1, 120)
  origin!: string;

  @IsString()
  @Length(1, 120)
  destination!: string;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsOptional()
  @IsPositive()
  estimatedCost?: number;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  purpose?: string;
}
