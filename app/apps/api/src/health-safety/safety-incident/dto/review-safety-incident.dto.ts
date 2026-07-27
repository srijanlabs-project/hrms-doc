import { IsString, Length } from "class-validator";

export class ReviewSafetyIncidentDto {
  @IsString()
  @Length(1, 2000)
  investigationNotes!: string;
}
