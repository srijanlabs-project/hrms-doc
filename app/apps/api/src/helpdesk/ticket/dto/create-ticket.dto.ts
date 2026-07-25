import { IsIn, IsOptional, IsString, Length } from "class-validator";

const QUEUES = ["HR", "IT", "Admin", "Finance"] as const;
const PRIORITIES = ["Low", "Medium", "High", "Urgent"] as const;

export class CreateTicketDto {
  @IsIn(QUEUES)
  queue!: (typeof QUEUES)[number];

  @IsString()
  @Length(1, 80)
  category!: string;

  @IsString()
  @Length(1, 150)
  subject!: string;

  @IsString()
  @Length(1, 4000)
  description!: string;

  @IsOptional()
  @IsIn(PRIORITIES)
  priority?: (typeof PRIORITIES)[number];
}

export { PRIORITIES, QUEUES };
