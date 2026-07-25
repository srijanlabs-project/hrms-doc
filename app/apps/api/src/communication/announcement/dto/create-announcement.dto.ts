import { IsIn, IsOptional, IsString, Length } from "class-validator";

const CATEGORIES = ["Policy", "Event", "Holiday", "General", "Urgent"] as const;

export class CreateAnnouncementDto {
  @IsString()
  @Length(1, 150)
  title!: string;

  @IsString()
  @Length(1, 4000)
  body!: string;

  @IsOptional()
  @IsIn(CATEGORIES)
  category?: (typeof CATEGORIES)[number];
}

export { CATEGORIES };
