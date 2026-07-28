import { IsString, Length } from "class-validator";

export class AddCareerPlanActionDto {
  @IsString()
  @Length(1, 300)
  title!: string;
}
