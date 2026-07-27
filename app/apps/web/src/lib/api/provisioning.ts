import { apiRequest } from "./http";

export interface ProvisionTenantResult {
  tenant: { id: string; code: string; name: string };
  admin: { id: string; email: string; roles: string[] };
}

export function provisionTenant(
  platformKey: string,
  input: { tenantCode: string; tenantName: string; adminEmail: string },
): Promise<ProvisionTenantResult> {
  return apiRequest("/platform/tenants", {
    method: "POST",
    headers: { "X-Platform-Key": platformKey },
    body: JSON.stringify(input),
  });
}
