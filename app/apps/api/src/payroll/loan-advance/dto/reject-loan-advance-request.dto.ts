import { IsString, Length } from "class-validator";

export class RejectLoanAdvanceRequestDto {
  @IsString()
  @Length(1, 500)
  decisionNote!: string;
}
