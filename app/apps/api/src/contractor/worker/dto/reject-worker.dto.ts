import { IsString, Length } from "class-validator";

export class RejectWorkerDto {
  @IsString()
  @Length(1, 500)
  reason!: string;
}
