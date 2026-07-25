import { IsDateString } from "class-validator";

export class PublishRosterDto {
  @IsDateString()
  from!: string;

  @IsDateString()
  to!: string;
}
