import { apiRequest } from "./http";
import type { ExitSummary } from "./types";

export function getMyExitSummary(): Promise<ExitSummary> {
  return apiRequest<ExitSummary>("/exit/me");
}
