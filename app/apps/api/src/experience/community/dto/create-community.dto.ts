import { IsIn, IsOptional, IsString, Length } from "class-validator";

const CATEGORIES = ["General", "Hobby", "Sports", "Wellness", "Learning", "Volunteering"] as const;

export class CreateCommunityDto {
  @IsString() @Length(2, 160) name!: string;
  @IsOptional() @IsString() @Length(0, 500) description?: string;
  @IsOptional() @IsIn(CATEGORIES) category?: (typeof CATEGORIES)[number];
}

export { CATEGORIES as COMMUNITY_CATEGORIES };
