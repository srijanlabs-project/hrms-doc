import { IsIn, IsOptional, IsString, IsUUID, Length, Matches } from "class-validator";

const CAREER_TRACKS = ["IC", "Managerial"] as const;

export class CreateDesignationDto {
  @IsString()
  @Matches(/^[A-Z0-9_-]{2,20}$/, {
    message: "code must be 2-20 uppercase alphanumeric characters, - or _",
  })
  code!: string;

  @IsString()
  @Length(2, 120)
  title!: string;

  @IsOptional()
  @IsUUID()
  jobFunctionId?: string;

  @IsOptional()
  @IsIn(CAREER_TRACKS)
  careerTrack?: (typeof CAREER_TRACKS)[number];
}
