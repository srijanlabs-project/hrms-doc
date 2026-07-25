import { IsIn, IsInt, IsOptional, IsString, IsUUID, Length, Max, Min } from "class-validator";

const RECOGNITION_VALUES = [
  "Teamwork",
  "Innovation",
  "Customer Focus",
  "Excellence",
  "Leadership",
  "Going the Extra Mile",
] as const;

export class GiveRecognitionDto {
  @IsUUID()
  toEmployeeId!: string;

  @IsIn(RECOGNITION_VALUES)
  value!: (typeof RECOGNITION_VALUES)[number];

  @IsString()
  @Length(1, 500)
  message!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  points?: number;
}

export { RECOGNITION_VALUES };
