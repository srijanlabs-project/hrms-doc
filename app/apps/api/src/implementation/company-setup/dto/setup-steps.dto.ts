import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  Min,
  ValidateNested,
} from "class-validator";

const CODE = /^[A-Z0-9_-]{2,20}$/;
const CODE_MSG = { message: "must be 2-20 uppercase alphanumeric characters, - or _" };

/** Step 1 — org structure. `parentCode` refers to another row in this same payload or an already-created department; the service resolves it to a real UUID FK, parents first. */
export class SetupDepartmentRow {
  @IsString() @Matches(CODE, CODE_MSG) code!: string;
  @IsString() @Length(2, 120) name!: string;
  @IsOptional() @IsString() @Matches(CODE, CODE_MSG) parentCode?: string;
}

export class SetupDesignationRow {
  @IsString() @Matches(CODE, CODE_MSG) code!: string;
  @IsString() @Length(2, 120) title!: string;
  @IsOptional() @IsIn(["IC", "Managerial"]) careerTrack?: "IC" | "Managerial";
}

export class SetupGradeRow {
  @IsString() @Matches(CODE, CODE_MSG) code!: string;
  @IsString() @Length(2, 120) name!: string;
  @IsOptional() @IsString() @Length(1, 40) band?: string;
}

export class SetupStructureDto {
  @IsOptional() @IsBoolean() dryRun?: boolean;

  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => SetupDepartmentRow)
  departments?: SetupDepartmentRow[];

  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => SetupDesignationRow)
  designations?: SetupDesignationRow[];

  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => SetupGradeRow)
  grades?: SetupGradeRow[];
}

/** Step 2 — employee details only. Manager is deliberately NOT here: it's step 3, so a whole roster can land before any reporting line is resolvable. */
export class SetupEmployeeRow {
  @IsString() @Matches(CODE, CODE_MSG) employeeCode!: string;

  @IsString()
  @Length(1, 120)
  @Matches(/^[\p{L}\p{M}\s'.-]+$/u, {
    message: "legalName may only contain letters, spaces, apostrophes, hyphens, and periods",
  })
  legalName!: string;

  @IsOptional() @IsEmail() personalEmail?: string;
  @IsOptional() @IsDateString() joiningDate?: string;
  @IsOptional() @IsDateString() dateOfBirth?: string;
  @IsOptional() @IsString() @Matches(/^\+?[0-9]{7,15}$/) mobileNumber?: string;
  @IsOptional() @IsString() @Matches(CODE, CODE_MSG) departmentCode?: string;
  @IsOptional() @IsString() @Matches(CODE, CODE_MSG) designationCode?: string;
  @IsOptional() @IsString() @Matches(CODE, CODE_MSG) gradeCode?: string;
}

export class SetupEmployeesDto {
  @IsOptional() @IsBoolean() dryRun?: boolean;
  @IsArray() @ValidateNested({ each: true }) @Type(() => SetupEmployeeRow) employees!: SetupEmployeeRow[];
}

/** Step 3 — reporting lines, applied only after every employee exists so both sides of each edge resolve. */
export class SetupManagerRow {
  @IsString() @Matches(CODE, CODE_MSG) employeeCode!: string;
  @IsString() @Matches(CODE, CODE_MSG) managerEmployeeCode!: string;
}

export class SetupManagersDto {
  @IsOptional() @IsBoolean() dryRun?: boolean;
  @IsArray() @ValidateNested({ each: true }) @Type(() => SetupManagerRow) mappings!: SetupManagerRow[];
}

/** Step 4 — salary. Leave needs no per-employee row: LeavePolicy is company-wide and balance is computed live, so a policy created once covers the whole roster. */
export class SetupSalaryRow {
  @IsString() @Matches(CODE, CODE_MSG) employeeCode!: string;
  @IsNumber() @Min(0) monthlyBasic!: number;
  @IsDateString() effectiveFrom!: string;
}

export class SetupSalaryDto {
  @IsOptional() @IsBoolean() dryRun?: boolean;
  @IsArray() @ValidateNested({ each: true }) @Type(() => SetupSalaryRow) salaries!: SetupSalaryRow[];
}
