import { IsString, Length } from "class-validator";

export class MfaChallengeDto {
  @IsString()
  pendingToken!: string;

  @IsString()
  @Length(6, 6)
  code!: string;
}
