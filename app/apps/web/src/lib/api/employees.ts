import { apiRequest } from "./http";
import type { BulkImportRowResult, CreateEmployeeInput, Employee } from "./types";

export function listEmployees(): Promise<Employee[]> {
  return apiRequest<Employee[]>("/people/employees");
}

export function getEmployee(id: string): Promise<Employee> {
  return apiRequest<Employee>(`/people/employees/${id}`);
}

export function createEmployee(input: CreateEmployeeInput): Promise<Employee> {
  return apiRequest<Employee>("/people/employees", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function bulkImportEmployees(rows: Record<string, unknown>[]): Promise<BulkImportRowResult[]> {
  return apiRequest<BulkImportRowResult[]>("/people/employees/bulk", {
    method: "POST",
    body: JSON.stringify({ rows }),
  });
}

export function separateEmployee(id: string, lastWorkingDay: string, reason?: string): Promise<Employee> {
  return apiRequest<Employee>(`/people/employees/${id}/separate`, {
    method: "POST",
    body: JSON.stringify({ lastWorkingDay, reason }),
  });
}
