/** Mirrors apps/api Prisma models. Hand-authored until OpenAPI codegen exists (see http.ts). */

export interface Department {
  id: string;
  code: string;
  name: string;
  status: string;
  parentDepartmentId: string | null;
  createdAt: string;
}

export interface EmployeeDepartmentRef {
  id: string;
  name: string;
}

export interface Employee {
  id: string;
  employeeCode: string;
  legalName: string;
  preferredName: string | null;
  dateOfBirth: string | null;
  personalEmail: string | null;
  mobileNumber: string | null;
  departmentId: string | null;
  department: EmployeeDepartmentRef | null;
  managerId: string | null;
  status: string;
  joiningDate: string | null;
  createdAt: string;
}

export interface CreateEmployeeInput {
  employeeCode: string;
  legalName: string;
  preferredName?: string;
  dateOfBirth?: string;
  personalEmail?: string;
  mobileNumber?: string;
  departmentId?: string;
  managerId?: string;
  joiningDate?: string;
}
