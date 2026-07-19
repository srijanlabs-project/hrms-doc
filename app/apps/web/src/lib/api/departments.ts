import { apiRequest } from "./http";
import type { Department } from "./types";

export function listDepartments(): Promise<Department[]> {
  return apiRequest<Department[]>("/org/departments");
}
