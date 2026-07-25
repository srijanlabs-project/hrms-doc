import { IsString, Length } from "class-validator";

export class WaiveTaskDto {
  @IsString()
  @Length(2, 500)
  note!: string;
}
