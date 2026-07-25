import { IsIn, IsString, Length } from "class-validator";

const CATEGORIES = ["OfferLetter", "ExperienceLetter", "SalaryCertificate", "BankAdvice", "Other"] as const;

export class CreateTemplateDto {
  @IsString()
  @Length(1, 120)
  name!: string;

  @IsIn(CATEGORIES)
  category!: (typeof CATEGORIES)[number];

  @IsString()
  @Length(1, 20000)
  bodyTemplate!: string;
}
