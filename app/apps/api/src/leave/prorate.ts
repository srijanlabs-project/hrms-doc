/** Rounds to 2 decimal places — leave days are commonly fractional (half-days). */
export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Live pro-rata entitlement for the calendar year containing `asOf`, based
 * on months elapsed since the later of (year start, joining date), inclusive
 * of the current month, capped at the full annual entitlement. Deliberately
 * not a persisted ledger — see LeaveRequest's schema comment for why.
 */
export function prorateEntitlement(annualDays: number, joiningDate: Date | null, asOf: Date): number {
  const yearStart = Date.UTC(asOf.getUTCFullYear(), 0, 1);
  const joining = joiningDate
    ? Date.UTC(joiningDate.getUTCFullYear(), joiningDate.getUTCMonth(), joiningDate.getUTCDate())
    : yearStart;
  const effectiveStart = Math.max(yearStart, joining);
  const asOfDay = Date.UTC(asOf.getUTCFullYear(), asOf.getUTCMonth(), asOf.getUTCDate());
  if (effectiveStart > asOfDay) return 0;

  const startDate = new Date(effectiveStart);
  const monthsElapsed =
    (asOf.getUTCFullYear() - startDate.getUTCFullYear()) * 12 + (asOf.getUTCMonth() - startDate.getUTCMonth()) + 1;
  const cappedMonths = Math.min(12, Math.max(0, monthsElapsed));
  return round2((annualDays * cappedMonths) / 12);
}
