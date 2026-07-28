import { apiRequest } from "./http";

export interface PermissionMatrixRow {
  module: string;
  method: string;
  path: string;
  access: string;
}

export function getPermissionsMatrix(): Promise<PermissionMatrixRow[]> {
  return apiRequest<PermissionMatrixRow[]>("/security/permissions-matrix");
}
