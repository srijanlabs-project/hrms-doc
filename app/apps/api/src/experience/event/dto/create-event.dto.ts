import { IsDateString, IsOptional, IsString, Length } from "class-validator";

export class CreateEventDto {
  @IsString() @Length(2, 160) title!: string;
  @IsOptional() @IsString() @Length(0, 1000) description?: string;
  @IsOptional() @IsString() @Length(0, 200) location?: string;
  @IsDateString() startAt!: string;
}
