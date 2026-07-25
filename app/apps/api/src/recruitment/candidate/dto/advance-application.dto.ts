import { IsIn } from "class-validator";

const APPLICATION_STAGES = ["Applied", "Screening", "Interview", "Offer", "Hired"] as const;

export class AdvanceApplicationDto {
  @IsIn(APPLICATION_STAGES)
  stage!: (typeof APPLICATION_STAGES)[number];
}
