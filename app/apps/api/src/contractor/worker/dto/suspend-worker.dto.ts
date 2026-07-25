import { IsString, Length } from "class-validator";

export class SuspendWorkerDto {
  @IsString()
  @Length(1, 500)
  reason!: string;
}
