/**
 * Fixed v1 checklist, applied to every onboarding case regardless of worker
 * type or geography. Real configurable checklist templates
 * (docs/08-submodule-specifications/02-people-management/09-onboarding.md
 * §13) are deferred — this is the single source of truth for what "activate"
 * checks against.
 */
export const ONBOARDING_TASKS: { title: string; isBlocking: boolean }[] = [
  { title: "Submit government ID proof", isBlocking: true },
  { title: "Submit bank account details", isBlocking: true },
  { title: "Complete IT asset allocation", isBlocking: true },
  { title: "Complete induction session", isBlocking: false },
];
