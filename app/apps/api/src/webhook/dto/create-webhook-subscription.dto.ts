import { ArrayMinSize, IsArray, IsIn, IsUrl } from "class-validator";

const EVENT_TYPES = [
  "*",
  "leave.request.approved",
  "leave.request.rejected",
  "expense.claim.approved",
  "expense.claim.rejected",
  "payroll.run.approved",
] as const;

export class CreateWebhookSubscriptionDto {
  @IsUrl({ require_tld: false, protocols: ["http", "https"] })
  url!: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsIn(EVENT_TYPES, { each: true })
  eventTypes!: string[];
}
