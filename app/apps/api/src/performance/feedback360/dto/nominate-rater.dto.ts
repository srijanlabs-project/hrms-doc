import { IsIn, IsUUID } from "class-validator";

const RATER_CATEGORIES = ["Manager", "Peer", "DirectReport", "Self"] as const;

export class NominateRaterDto {
  @IsUUID()
  raterEmployeeId!: string;

  @IsIn(RATER_CATEGORIES)
  category!: (typeof RATER_CATEGORIES)[number];
}
