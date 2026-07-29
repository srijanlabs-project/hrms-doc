import { IsIn } from "class-validator";

const MEDICAL_FIELDS = ["allergies", "medicalConditions", "physicianName", "physicianPhone"] as const;
export type MedicalField = (typeof MEDICAL_FIELDS)[number];

export class RevealMedicalFieldDto {
  @IsIn(MEDICAL_FIELDS)
  field!: MedicalField;
}
