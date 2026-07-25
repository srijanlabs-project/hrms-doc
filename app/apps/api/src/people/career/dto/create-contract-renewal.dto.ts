import { IsDateString, IsOptional, IsString, Length } from "class-validator";

export class CreateContractRenewalDto {
  @IsDateString()
  newEndDate!: string;

  @IsOptional()
  @IsString()
  @Length(0, 300)
  note?: string;
}
