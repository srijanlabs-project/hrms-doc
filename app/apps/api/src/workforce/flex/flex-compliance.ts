import type { FlexibleHoursPolicy } from "@prisma/client";

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Pure compliance check, no cross-midnight handling — same-day check-in/check-out
 * only, matching the self-reported (not punch-clock-captured) nature of the data.
 * Compliant means: present for the full core-hours window and worked at least
 * the policy's required daily minutes.
 */
export function evaluateFlexCompliance(policy: FlexibleHoursPolicy, checkInTime: string, checkOutTime: string): boolean {
  const checkIn = toMinutes(checkInTime);
  const checkOut = toMinutes(checkOutTime);
  const coreStart = toMinutes(policy.coreStartTime);
  const coreEnd = toMinutes(policy.coreEndTime);
  if (checkOut <= checkIn) return false;

  const workedMinutes = checkOut - checkIn;
  const coveredCoreHours = checkIn <= coreStart && checkOut >= coreEnd;
  return coveredCoreHours && workedMinutes >= policy.requiredDailyMinutes;
}
