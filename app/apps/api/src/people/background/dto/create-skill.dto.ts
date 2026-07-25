import { IsIn, IsOptional, IsString, Length } from "class-validator";

const SKILL_TYPES = ["Skill", "Language"] as const;
const PROFICIENCY_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"] as const;

export class CreateSkillDto {
  @IsIn(SKILL_TYPES)
  skillType!: (typeof SKILL_TYPES)[number];

  @IsString()
  @Length(1, 80)
  name!: string;

  @IsOptional()
  @IsIn(PROFICIENCY_LEVELS)
  proficiencyLevel?: (typeof PROFICIENCY_LEVELS)[number];
}
