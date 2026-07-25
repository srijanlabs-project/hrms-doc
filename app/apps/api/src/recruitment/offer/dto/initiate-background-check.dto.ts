import { IsIn, IsOptional } from "class-validator";

const CHECK_TYPES = ["Identity", "Employment", "Education", "Criminal", "Comprehensive"] as const;

export class InitiateBackgroundCheckDto {
  @IsOptional()
  @IsIn(CHECK_TYPES)
  checkType?: (typeof CHECK_TYPES)[number];
}
