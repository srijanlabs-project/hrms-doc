import { IsIn } from "class-validator";

const RESPONSES = ["Going", "Interested", "Declined"] as const;

export class RsvpEventDto {
  @IsIn(RESPONSES) response!: (typeof RESPONSES)[number];
}

export { RESPONSES as RSVP_RESPONSES };
