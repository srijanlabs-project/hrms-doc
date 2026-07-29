import { apiRequest } from "./http";

export interface DepartmentBudgetSummary {
  departmentId: string;
  periodYear: number;
  allocatedAmount: number;
  spentTotal: number;
  remaining: number;
  utilizationPercent: number | null;
  breakdown: { expenseTotal: number; perDiemTotal: number; travelAdvanceTotal: number };
}

/** W5·P gap closure ("budget approvals") — a live-computed spend rollup, not a new approval workflow. */
export function getMyDepartmentBudget(year?: number): Promise<DepartmentBudgetSummary | null> {
  return apiRequest(`/mss/budget/mine${year ? `?year=${year}` : ""}`);
}

export function getDepartmentBudget(departmentId: string, year?: number): Promise<DepartmentBudgetSummary> {
  return apiRequest(`/mss/budget/departments/${departmentId}${year ? `?year=${year}` : ""}`);
}

export function setDepartmentBudget(departmentId: string, periodYear: number, allocatedAmount: number) {
  return apiRequest(`/mss/budget/departments/${departmentId}`, {
    method: "PUT",
    body: JSON.stringify({ periodYear, allocatedAmount }),
  });
}
