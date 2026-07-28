import { apiRequest } from "./http";
import type { ComplianceOverview } from "./types";

export function getComplianceOverview(): Promise<ComplianceOverview> {
  return apiRequest<ComplianceOverview>("/security/compliance-overview");
}
