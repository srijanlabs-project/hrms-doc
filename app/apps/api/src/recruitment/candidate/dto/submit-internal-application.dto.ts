import { IsUUID } from "class-validator";

export class SubmitInternalApplicationDto {
  @IsUUID()
  requisitionId!: string;
}
