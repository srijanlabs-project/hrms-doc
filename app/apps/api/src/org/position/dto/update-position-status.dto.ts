import { IsIn } from "class-validator";

const STATUSES = ["Open", "Filled", "Frozen", "Closed"] as const;

export class UpdatePositionStatusDto {
  @IsIn(STATUSES)
  status!: (typeof STATUSES)[number];
}
