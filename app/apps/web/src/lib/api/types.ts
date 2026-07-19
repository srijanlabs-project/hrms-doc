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

export interface LeavePolicy {
  id: string;
  leaveType: string;
  name: string;
  annualDays: number;
  status: string;
}

export interface LeaveBalance {
  leaveType: string;
  name: string;
  entitlement: number;
  prorated: number;
  consumed: number;
  available: number;
}

export interface LeaveRequestEmployeeRef {
  id: string;
  legalName: string;
  employeeCode: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employee: LeaveRequestEmployeeRef;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string | null;
  status: string;
  approverId: string | null;
  decisionNote: string | null;
  decidedAt: string | null;
  createdAt: string;
}

export interface CreateLeaveRequestInput {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string;
  linkPath: string | null;
  readAt: string | null;
  createdAt: string;
}
