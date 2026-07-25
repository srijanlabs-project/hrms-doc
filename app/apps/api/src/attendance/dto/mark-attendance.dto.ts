import { IsDateString, IsIn, IsOptional, Matches } from "class-validator";

const ATTENDANCE_STATUSES = ["Present", "Absent", "HalfDay"] as const;
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

export class MarkAttendanceDto {
  @IsDateString()
  date!: string;

  @IsIn(ATTENDANCE_STATUSES)
  status!: (typeof ATTENDANCE_STATUSES)[number];

  /** Self-reported — evaluated against the employee's active flex-hours policy, if any. */
  @IsOptional()
  @Matches(TIME_PATTERN, { message: "checkInTime must be in HH:mm 24-hour format." })
  checkInTime?: string;

  @IsOptional()
  @Matches(TIME_PATTERN, { message: "checkOutTime must be in HH:mm 24-hour format." })
  checkOutTime?: string;
}
