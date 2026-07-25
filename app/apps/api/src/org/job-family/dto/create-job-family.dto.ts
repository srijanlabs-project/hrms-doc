import { IsString, Length, Matches } from "class-validator";

export class CreateJobFamilyDto {
  @IsString()
  @Matches(/^[A-Z0-9_-]{2,20}$/, {
    message: "code must be 2-20 uppercase alphanumeric characters, - or _",
  })
  code!: string;

  @IsString()
  @Length(2, 120)
  name!: string;
}
