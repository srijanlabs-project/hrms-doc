import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { FlexAdminPanel } from "./FlexAdminPanel";
import { MyWeekPanel } from "./MyWeekPanel";
import { OvertimePanel } from "./OvertimePanel";
import { RosterAdminPanel } from "./RosterAdminPanel";
import { RosterSwapsPanel } from "./RosterSwapsPanel";
import { RotationAdminPanel } from "./RotationAdminPanel";
import { ShiftAdminPanel } from "./ShiftAdminPanel";
import { TimesheetsPanel } from "./TimesheetsPanel";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/**
 * Wave 2 W2·E07 Workforce Management hub. Four real sub-capabilities:
 * shift + roster (consolidating 04-rostering.md and 07-workforce-scheduling.md),
 * timesheets, and overtime. Attendance already lives at /attendance (Phase 5);
 * biometric integration (02-biometric-integration.md) is a deliberate deferral
 * — no hardware/device-capture channel exists in this environment.
 */
export function WorkforceHubPage() {
  const { user } = useAuth();
  const isAdmin = ADMIN_ROLES.some((role) => user?.roles.includes(role));
  const tabs = ["My Week", "Swaps", "Timesheets", "Overtime", ...(isAdmin ? ["Admin"] : [])] as const;
  const [tab, setTab] = useState<(typeof tabs)[number]>("My Week");

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold">Workforce</h1>
        <p className="text-ink-muted">Shifts, roster, timesheets, and overtime.</p>
      </header>

      <div className="flex gap-1 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={
              tab === t
                ? "border-b-2 border-primary px-4 py-2 font-medium text-primary"
                : "px-4 py-2 font-medium text-ink-muted hover:text-ink"
            }
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "My Week" && <MyWeekPanel />}
      {tab === "Swaps" && <RosterSwapsPanel />}
      {tab === "Timesheets" && <TimesheetsPanel />}
      {tab === "Overtime" && <OvertimePanel />}
      {tab === "Admin" && isAdmin && (
        <div className="space-y-4">
          <ShiftAdminPanel />
          <RosterAdminPanel />
          <RotationAdminPanel />
          <FlexAdminPanel />
        </div>
      )}
    </div>
  );
}
