import { apiRequest } from "./http";
import type { ShiftDefinition } from "./types";

export interface ShiftRotationStep {
  id: string;
  weekIndex: number;
  shiftId: string;
  shift: ShiftDefinition;
}

export interface ShiftRotationPattern {
  id: string;
  name: string;
  cadenceWeeks: number;
  isActive: boolean;
  steps: ShiftRotationStep[];
}

export function listRotationPatterns(): Promise<ShiftRotationPattern[]> {
  return apiRequest<ShiftRotationPattern[]>("/workforce/rotation/patterns");
}

export function createRotationPattern(input: { name: string; shiftIds: string[] }): Promise<ShiftRotationPattern> {
  return apiRequest<ShiftRotationPattern>("/workforce/rotation/patterns", { method: "POST", body: JSON.stringify(input) });
}

export function assignRotation(input: { employeeId: string; patternId: string; anchorWeekStart: string }): Promise<unknown> {
  return apiRequest("/workforce/rotation/assign", { method: "POST", body: JSON.stringify(input) });
}

export function generateRosterFromRotation(input: { employeeId: string; from: string; to: string }): Promise<{ generatedCount: number }> {
  return apiRequest<{ generatedCount: number }>("/workforce/rotation/generate", { method: "POST", body: JSON.stringify(input) });
}
