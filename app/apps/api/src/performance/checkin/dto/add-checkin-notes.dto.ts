import { IsString, Length } from "class-validator";

export class AddCheckInNotesDto {
  @IsString()
  @Length(1, 2000)
  notes!: string;
}
