import { IsString, Length } from "class-validator";

export class AskAiDto {
  @IsString()
  @Length(1, 500)
  message!: string;
}
