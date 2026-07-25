import { IsString, Length } from "class-validator";

export class RevokeCertificationRecordDto {
  @IsString()
  @Length(2, 500)
  reason!: string;
}
