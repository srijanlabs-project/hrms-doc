import { IsBoolean, IsIn, IsOptional, IsString, Length } from "class-validator";
import { QUEUES } from "../../ticket/dto/create-ticket.dto";

export class CreateKnowledgeArticleDto {
  @IsIn(QUEUES)
  queue!: (typeof QUEUES)[number];

  @IsString()
  @Length(1, 150)
  title!: string;

  @IsString()
  @Length(1, 8000)
  body!: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
