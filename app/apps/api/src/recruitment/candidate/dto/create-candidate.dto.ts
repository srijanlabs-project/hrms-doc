import { ArrayMaxSize, IsArray, IsEmail, IsIn, IsOptional, IsString, Length } from "class-validator";

const CANDIDATE_SOURCES = ["Direct", "Referral", "JobBoard"] as const;

export class CreateCandidateDto {
  @IsString()
  @Length(2, 120)
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsIn(CANDIDATE_SOURCES)
  source?: (typeof CANDIDATE_SOURCES)[number];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  notes?: string;
}
