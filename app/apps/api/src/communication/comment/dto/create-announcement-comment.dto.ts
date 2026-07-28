import { IsString, Length } from "class-validator";

export class CreateAnnouncementCommentDto {
  @IsString() @Length(1, 1000) body!: string;
}
