import { apiRequest } from "./http";

export interface RowResult {
  entity: string;
  code: string;
  success: boolean;
  error?: string;
}

export interface StepResult {
  dryRun: boolean;
  total: number;
  succeeded: number;
  failed: number;
  results: RowResult[];
}

export interface SetupStatus {
  departments: number;
  designations: number;
  grades: number;
  employees: number;
  withManager: number;
  withSalary: number;
}

export type SetupStepKey = "structure" | "employees" | "managers" | "salary";

export function getSetupStatus(): Promise<SetupStatus> {
  return apiRequest("/implementation/company-setup/status");
}

export function runSetupStep(step: SetupStepKey, payload: unknown, dryRun: boolean): Promise<StepResult> {
  return apiRequest(`/implementation/company-setup/${step}`, {
    method: "POST",
    body: JSON.stringify({ ...(payload as object), dryRun }),
  });
}

/** Starter payloads shown in each step's editor — a filled, valid example is faster to edit than a field list is to read. */
export const STEP_TEMPLATES: Record<SetupStepKey, string> = {
  structure: JSON.stringify(
    {
      departments: [
        { code: "ENG", name: "Engineering" },
        { code: "ENG-PLT", name: "Platform", parentCode: "ENG" },
        { code: "SALES", name: "Sales" },
      ],
      designations: [
        { code: "SE2", title: "Software Engineer II", careerTrack: "IC" },
        { code: "EM1", title: "Engineering Manager", careerTrack: "Managerial" },
      ],
      grades: [
        { code: "G4", name: "Grade 4", band: "Mid" },
        { code: "G6", name: "Grade 6", band: "Senior" },
      ],
    },
    null,
    2,
  ),
  employees: JSON.stringify(
    {
      employees: [
        {
          employeeCode: "EMP-001",
          legalName: "Asha Rao",
          personalEmail: "asha.rao@example.com",
          joiningDate: "2024-04-01",
          departmentCode: "ENG",
          designationCode: "EM1",
          gradeCode: "G6",
        },
        {
          employeeCode: "EMP-002",
          legalName: "Vikram Nair",
          personalEmail: "vikram.nair@example.com",
          joiningDate: "2024-06-15",
          departmentCode: "ENG-PLT",
          designationCode: "SE2",
          gradeCode: "G4",
        },
      ],
    },
    null,
    2,
  ),
  managers: JSON.stringify(
    { mappings: [{ employeeCode: "EMP-002", managerEmployeeCode: "EMP-001" }] },
    null,
    2,
  ),
  salary: JSON.stringify(
    {
      salaries: [
        { employeeCode: "EMP-001", monthlyBasic: 180000, effectiveFrom: "2024-04-01" },
        { employeeCode: "EMP-002", monthlyBasic: 95000, effectiveFrom: "2024-06-15" },
      ],
    },
    null,
    2,
  ),
};
