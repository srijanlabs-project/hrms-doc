import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Card } from "../../components/ui/Card";
import { listMyLeaveRequests } from "../../lib/api/leave";
import type { LeaveRequest } from "../../lib/api/types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DOT_TONE: Record<string, string> = {
  Approved: "bg-positive",
  Pending: "bg-warning",
  Rejected: "bg-negative",
  Cancelled: "bg-ink-faint",
};

function expandDates(startIso: string, endIso: string): string[] {
  const days: string[] = [];
  let cursor = new Date(startIso);
  const last = new Date(endIso);
  while (cursor <= last) {
    days.push(cursor.toISOString().slice(0, 10));
    cursor = new Date(cursor.getTime() + 86_400_000);
  }
  return days;
}

function buildMonthGrid(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(Date.UTC(year, month, 1));
  const startOffset = firstDay.getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells: (Date | null)[] = Array.from({ length: startOffset }, () => null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(Date.UTC(year, month, d)));
  return cells;
}

/** T-008 Calendar & Attendance Workspace -> leave-only month view (attendance/shift data doesn't exist yet). */
export function LeaveCalendarPage() {
  const [cursor, setCursor] = useState(() => new Date());
  const requests = useQuery({ queryKey: ["leave-requests-my"], queryFn: listMyLeaveRequests });

  const year = cursor.getUTCFullYear();
  const month = cursor.getUTCMonth();
  const grid = useMemo(() => buildMonthGrid(year, month), [year, month]);

  const byDate = useMemo(() => {
    const map = new Map<string, LeaveRequest>();
    for (const request of requests.data ?? []) {
      if (request.status === "Cancelled" || request.status === "Rejected") continue;
      for (const day of expandDates(request.startDate, request.endDate)) {
        map.set(day, request);
      }
    }
    return map;
  }, [requests.data]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Time Off Calendar</h1>
        <p className="text-ink-muted">Your approved and pending leave for the month.</p>
      </header>

      <Card
        title={cursor.toLocaleDateString("en-IN", { month: "long", year: "numeric", timeZone: "UTC" })}
        action={
          <div className="flex gap-1">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => setCursor(new Date(Date.UTC(year, month - 1, 1)))}
              className="rounded-lg p-1.5 hover:bg-canvas"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => setCursor(new Date(Date.UTC(year, month + 1, 1)))}
              className="rounded-lg p-1.5 hover:bg-canvas"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase text-ink-faint">
          {WEEKDAYS.map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {grid.map((date, i) => {
            const key = date?.toISOString().slice(0, 10);
            const leave = key ? byDate.get(key) : undefined;
            return (
              <div
                key={i}
                className={`flex h-16 flex-col items-center justify-start rounded-lg border p-1 text-sm ${
                  date ? "border-border" : "border-transparent"
                }`}
              >
                {date && <span>{date.getUTCDate()}</span>}
                {leave && (
                  <span
                    title={`${leave.leaveType} (${leave.status})`}
                    className={`mt-1 h-1.5 w-1.5 rounded-full ${DOT_TONE[leave.status] ?? "bg-ink-faint"}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
