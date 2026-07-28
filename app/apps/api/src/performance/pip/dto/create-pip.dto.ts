import { ArrayMaxSize, ArrayMinSize, IsArray, IsDateString, IsString, IsUUID, Length } from "class-validator";

export class CreatePipDto {
  @IsUUID()
  employeeId!: string;

  @IsString()
  @Length(1, 1000)
  reason!: string;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @IsString({ each: true })
  objectives!: string[];
}
