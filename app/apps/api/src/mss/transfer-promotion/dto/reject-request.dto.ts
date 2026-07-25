import { IsString, Length } from "class-validator";

export class RejectTransferPromotionRequestDto {
  @IsString()
  @Length(1, 500)
  decisionNote!: string;
}
