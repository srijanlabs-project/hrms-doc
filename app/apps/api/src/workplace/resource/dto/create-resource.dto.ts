import { IsIn, IsInt, IsOptional, IsString, Length, Min } from "class-validator";

const RESOURCE_TYPES = ["Desk", "Room", "Parking", "Shuttle", "Cafeteria"] as const;

export class CreateResourceDto {
  @IsIn(RESOURCE_TYPES)
  type!: (typeof RESOURCE_TYPES)[number];

  @IsString()
  @Length(1, 120)
  name!: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  location?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;
}

export { RESOURCE_TYPES };
