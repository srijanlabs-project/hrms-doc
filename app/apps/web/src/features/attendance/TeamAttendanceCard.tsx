import { useQuery } from "@tanstack/react-query";
import { Avatar } from "../../components/ui/Avatar";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { listTeamAttendance } from "../../lib/api/attendance";
import { attendanceStatusTone } from "./status-tone";

/** Manager-only: direct reports' status for a single day. Empty for anyone with no direct reports — no error, just nothing to show. */
export function TeamAttendanceCard({ date }: { date: string }) {
  const team = useQuery({ queryKey: ["attendance-team", date], queryFn: () => listTeamAttendance(date) });

  if (!team.isLoading && (team.data?.length ?? 0) === 0) return null;

  return (
    <Card title="Team Attendance Today">
      {team.isLoading && <p className="text-ink-muted">Loading team…</p>}
      <ul className="space-y-3">
        {team.data?.map((entry) => (
          <li key={entry.employeeId} className="flex items-center gap-3">
            <Avatar name={entry.legalName} size="sm" />
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium">{entry.legalName}</div>
              <div className="truncate text-xs text-ink-faint">{entry.department ?? entry.employeeCode}</div>
            </div>
            <Badge tone={attendanceStatusTone(entry.status)}>{entry.status}</Badge>
          </li>
        ))}
      </ul>
    </Card>
  );
}
