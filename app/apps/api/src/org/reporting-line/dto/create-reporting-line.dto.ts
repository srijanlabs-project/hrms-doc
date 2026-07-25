import { IsDateString, IsIn, IsOptional, IsString, IsUUID, Length } from "class-validator";

const LINE_TYPES = ["Dotted", "Matrix", "Acting"] as const;

export class CreateReportingLineDto {
  @IsUUID()
  employeeId!: string;

  @IsUUID()
  managerId!: string;

  @IsIn(LINE_TYPES)
  lineType!: (typeof LINE_TYPES)[number];

  @IsDateString()
  startDate!: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  @Length(0, 300)
  notes?: string;
}
