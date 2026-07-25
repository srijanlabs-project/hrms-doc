import { IsDateString, IsString, Length } from "class-validator";

export class CreateOrgPolicyDto {
  @IsString()
  @Length(2, 60)
  category!: string;

  @IsString()
  @Length(2, 160)
  title!: string;

  @IsString()
  @Length(1, 5000)
  content!: string;

  @IsDateString()
  effectiveFrom!: string;
}
