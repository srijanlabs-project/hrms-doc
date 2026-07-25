import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { KpiCard } from "../../components/ui/KpiCard";
import { listMyAttendance, markAttendance } from "../../lib/api/attendance";
import { getMyFlexPolicy } from "../../lib/api/flex";
import type { AttendanceDay } from "../../lib/api/types";
import { AttendanceMonthCard } from "./AttendanceMonthCard";
import { FlexHoursCheckIn } from "./FlexHoursCheckIn";
import { TeamAttendanceCard } from "./TeamAttendanceCard";
import { attendanceStatusTone } from "./status-tone";

const MARK_STATUSES = ["Present", "Absent", "HalfDay"] as const;

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function buildMonthGrid(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(Date.UTC(year, month, 1));
  const startOffset = firstDay.getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells: (Date | null)[] = Array.from({ length: startOffset }, () => null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(Date.UTC(year, month, d)));
  return cells;
}

/**
 * T-008 Calendar & Attendance Workspace -> self-service month view, v1 slice
 * of docs/08-submodule-specifications/07-workforce-management/01-attendance.md
 * (manual mark only, no punch/shift/geofence data — see AttendanceService).
 */
export function AttendancePage() {
  const queryClient = useQueryClient();
  const [cursor, setCursor] = useState(() => new Date());
  const today = todayIso();

  const year = cursor.getUTCFullYear();
  const month = cursor.getUTCMonth();
  const from = new Date(Date.UTC(year, month, 1)).toISOString().slice(0, 10);
  const to = new Date(Date.UTC(year, month + 1, 0)).toISOString().slice(0, 10);
  const grid = useMemo(() => buildMonthGrid(year, month), [year, month]);

  const attendance = useQuery({
    queryKey: ["attendance-my", from, to],
    queryFn: () => listMyAttendance(from, to),
  });

  const flexPolicy = useQuery({ queryKey: ["flex-mine"], queryFn: getMyFlexPolicy });
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");

  const markMutation = useMutation({
    mutationFn: (status: string) =>
      markAttendance({ date: today, status, checkInTime: checkInTime || undefined, checkOutTime: checkOutTime || undefined }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["attendance-my"] });
    },
  });

  const byDate = useMemo(() => {
    const map = new Map<string, AttendanceDay>();
    for (const day of attendance.data ?? []) map.set(day.date.slice(0, 10), day);
    return map;
  }, [attendance.data]);

  const todayStatus = byDate.get(today)?.status ?? "Not Marked";

  const counts = useMemo(() => {
    const result = { Present: 0, Absent: 0, HalfDay: 0 };
    for (const day of attendance.data ?? []) {
      if (day.status in result) result[day.status as keyof typeof result] += 1;
    }
    return result;
  }, [attendance.data]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Attendance</h1>
        <p className="text-ink-muted">Mark today's status and review your monthly record.</p>
      </header>

      <div className="grid grid-cols-3 gap-4">
        <KpiCard label="Present" value={String(counts.Present)} caption="This month" />
        <KpiCard label="Absent" value={String(counts.Absent)} caption="This month" />
        <KpiCard label="Half Day" value={String(counts.HalfDay)} caption="This month" />
      </div>

      <Card
        title="Today"
        action={<Badge tone={attendanceStatusTone(todayStatus)}>{todayStatus}</Badge>}
      >
        {flexPolicy.data && (
          <FlexHoursCheckIn
            assignment={flexPolicy.data}
            checkInTime={checkInTime}
            checkOutTime={checkOutTime}
            onCheckInChange={setCheckInTime}
            onCheckOutChange={setCheckOutTime}
            flexCompliant={byDate.get(today)?.flexCompliant}
          />
        )}
        <div className="flex flex-wrap gap-2">
          {MARK_STATUSES.map((status) => (
            <button
              key={status}
              type="button"
              disabled={markMutation.isPending}
              onClick={() => markMutation.mutate(status)}
              className={`rounded-lg border px-4 py-2 font-medium disabled:opacity-60 ${
                todayStatus === status
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border hover:border-primary"
              }`}
            >
              Mark {status === "HalfDay" ? "Half Day" : status}
            </button>
          ))}
        </div>
      </Card>

      <AttendanceMonthCard
        cursor={cursor}
        grid={grid}
        byDate={byDate}
        onPrevMonth={() => setCursor(new Date(Date.UTC(year, month - 1, 1)))}
        onNextMonth={() => setCursor(new Date(Date.UTC(year, month + 1, 1)))}
      />

      <TeamAttendanceCard date={today} />
    </div>
  );
}
