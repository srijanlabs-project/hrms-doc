import { apiRequest } from "./http";

export interface FlexibleHoursPolicy {
  id: string;
  name: string;
  coreStartTime: string;
  coreEndTime: string;
  requiredDailyMinutes: number;
  isActive: boolean;
}

export interface EmployeeFlexAssignment {
  id: string;
  employeeId: string;
  policyId: string;
  policy: FlexibleHoursPolicy;
  effectiveFrom: string;
  effectiveTo: string | null;
}

export function listFlexPolicies(): Promise<FlexibleHoursPolicy[]> {
  return apiRequest<FlexibleHoursPolicy[]>("/workforce/flex/policies");
}

export function createFlexPolicy(input: {
  name: string;
  coreStartTime: string;
  coreEndTime: string;
  requiredDailyMinutes: number;
}): Promise<FlexibleHoursPolicy> {
  return apiRequest<FlexibleHoursPolicy>("/workforce/flex/policies", { method: "POST", body: JSON.stringify(input) });
}

export function assignFlexPolicy(input: { employeeId: string; policyId: string; effectiveFrom: string }): Promise<EmployeeFlexAssignment> {
  return apiRequest<EmployeeFlexAssignment>("/workforce/flex/assign", { method: "POST", body: JSON.stringify(input) });
}

export function getMyFlexPolicy(): Promise<EmployeeFlexAssignment | null> {
  return apiRequest<EmployeeFlexAssignment | null>("/workforce/flex/mine");
}
