import { IsIn, IsOptional, IsString, Length } from "class-validator";

const DECISIONS = ["Approved", "Rejected"] as const;

export class SignoffTestRunDto {
  @IsIn(DECISIONS) decision!: (typeof DECISIONS)[number];
  @IsOptional() @IsString() @Length(0, 1000) notes?: string;
}
