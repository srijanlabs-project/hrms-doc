import { IsNotEmpty } from "class-validator";

export class CreateAuditCycleDto {
  @IsNotEmpty() periodLabel!: string;
}
