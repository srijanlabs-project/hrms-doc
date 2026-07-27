import { IsBoolean, IsDateString, IsInt, IsNumber, IsOptional, IsPositive, IsString, IsUUID, Length, Min } from "class-validator";

export class CreateRequisitionDto {
  @IsString()
  @Length(2, 20)
  code!: string;

  @IsString()
  @Length(2, 120)
  title!: string;

  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @IsOptional()
  @IsUUID()
  hiringManagerId?: string;

  @IsInt()
  @Min(1)
  headcount!: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  compensationMin?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  compensationMax?: number;

  @IsOptional()
  @IsDateString()
  targetJoinDate?: string;

  /** Internal Mobility: visible on the internal jobs board once Published. */
  @IsOptional()
  @IsBoolean()
  isInternal?: boolean;
}
