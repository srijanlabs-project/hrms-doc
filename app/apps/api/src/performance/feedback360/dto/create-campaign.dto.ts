import { IsInt, IsUUID, Min } from "class-validator";

export class CreateFeedbackCampaignDto {
  @IsUUID()
  subjectEmployeeId!: string;

  @IsInt()
  @Min(2000)
  cycleYear!: number;
}
