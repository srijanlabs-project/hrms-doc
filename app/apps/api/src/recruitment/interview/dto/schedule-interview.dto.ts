import { IsDateString, IsIn, IsOptional, IsUUID } from "class-validator";

const INTERVIEW_MODES = ["InPerson", "Video", "Phone"] as const;

export class ScheduleInterviewDto {
  @IsUUID()
  applicationId!: string;

  @IsUUID()
  interviewerId!: string;

  @IsDateString()
  scheduledAt!: string;

  @IsOptional()
  @IsIn(INTERVIEW_MODES)
  mode?: (typeof INTERVIEW_MODES)[number];
}
