import { apiRequest } from "./http";
import type {
  BonusEligibilityRow,
  LwfLiability,
  MinimumWageCheckRow,
  StatutoryComplianceSettings,
  UpdateStatutorySettingsInput,
} from "./types";

export function getStatutorySettings(): Promise<StatutoryComplianceSettings> {
  return apiRequest<StatutoryComplianceSettings>("/compliance/statutory/settings");
}

export function updateStatutorySettings(input: UpdateStatutorySettingsInput): Promise<StatutoryComplianceSettings> {
  return apiRequest<StatutoryComplianceSettings>("/compliance/statutory/settings", { method: "PUT", body: JSON.stringify(input) });
}

export function checkMinimumWages(): Promise<MinimumWageCheckRow[]> {
  return apiRequest<MinimumWageCheckRow[]>("/compliance/statutory/minimum-wage-check");
}

export function computeLwfLiability(): Promise<LwfLiability> {
  return apiRequest<LwfLiability>("/compliance/statutory/lwf-liability");
}

export function checkBonusEligibility(): Promise<BonusEligibilityRow[]> {
  return apiRequest<BonusEligibilityRow[]>("/compliance/statutory/bonus-eligibility");
}
