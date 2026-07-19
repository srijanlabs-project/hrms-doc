import { apiRequest } from "./http";
import type { CreateEmployeeInput, Employee } from "./types";

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
