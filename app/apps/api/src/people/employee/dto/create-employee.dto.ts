import { IsDateString, IsEmail, IsOptional, IsString, IsUUID, Length, Matches } from "class-validator";

/**
 * Structural validation per docs/07-appendices/18-field-validation-standards-and-rule-matrix.md.
 * `legalName` char class follows VAL-002 (Unicode letters/marks, spaces,
 * apostrophes, hyphens, periods — so names like "O'Brien" and "José" pass).
 * VAL-001 trim/collapse-whitespace and VAL-009 "date of birth must be in the
 * past" are business-date-logic rules applied in EmployeeService, not here.
 * `employeeCode` format is not spec-mandated; reuses the org module's
 * code convention for consistency across the app.
 */
export class CreateEmployeeDto {
  @IsString()
  @Matches(/^[A-Z0-9_-]{2,20}$/, {
    message: "employeeCode must be 2-20 uppercase alphanumeric characters, - or _",
  })
  employeeCode!: string;

  @IsString()
  @Length(1, 120)
  @Matches(/^[\p{L}\p{M}\s'.-]+$/u, {
    message: "legalName may only contain letters, spaces, apostrophes, hyphens, and periods",
  })
  legalName!: string;

  @IsOptional()
  @IsString()
  @Length(1, 120)
  @Matches(/^[\p{L}\p{M}\s'.-]+$/u, {
    message: "preferredName may only contain letters, spaces, apostrophes, hyphens, and periods",
  })
  preferredName?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsEmail()
  personalEmail?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9]{7,15}$/, { message: "mobileNumber must be 7-15 digits, optionally prefixed with +" })
  mobileNumber?: string;

  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @IsOptional()
  @IsUUID()
  managerId?: string;

  @IsOptional()
  @IsDateString()
  joiningDate?: string;
}
