import { IsIn, IsInt, IsPositive } from "class-validator";
import { PRIORITIES, QUEUES } from "../../ticket/dto/create-ticket.dto";

export class CreateSlaPolicyDto {
  @IsIn(QUEUES)
  queue!: (typeof QUEUES)[number];

  @IsIn(PRIORITIES)
  priority!: (typeof PRIORITIES)[number];

  @IsInt()
  @IsPositive()
  resolutionHours!: number;
}
