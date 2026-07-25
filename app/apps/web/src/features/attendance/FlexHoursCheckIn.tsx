import { Badge } from "../../components/ui/Badge";
import type { EmployeeFlexAssignment } from "../../lib/api/flex";

/** Shown on the Today card only when the employee has an active flex-hours assignment. */
export function FlexHoursCheckIn({
  assignment,
  checkInTime,
  checkOutTime,
  onCheckInChange,
  onCheckOutChange,
  flexCompliant,
}: {
  assignment: EmployeeFlexAssignment;
  checkInTime: string;
  checkOutTime: string;
  onCheckInChange: (value: string) => void;
  onCheckOutChange: (value: string) => void;
  flexCompliant: boolean | null | undefined;
}) {
  return (
    <div className="mb-3 flex flex-wrap items-end gap-2 rounded-lg border border-border bg-canvas p-2">
      <p className="w-full text-xs text-ink-muted">
        Flexible hours ({assignment.policy.name}): core hours {assignment.policy.coreStartTime}–{assignment.policy.coreEndTime},{" "}
        {assignment.policy.requiredDailyMinutes} min/day required.
      </p>
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-ink-muted">Check-in</span>
        <input type="time" value={checkInTime} onChange={(e) => onCheckInChange(e.target.value)} className="input" />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-ink-muted">Check-out</span>
        <input type="time" value={checkOutTime} onChange={(e) => onCheckOutChange(e.target.value)} className="input" />
      </label>
      {flexCompliant != null && (
        <Badge tone={flexCompliant ? "positive" : "negative"}>{flexCompliant ? "Compliant" : "Non-compliant"}</Badge>
      )}
    </div>
  );
}
