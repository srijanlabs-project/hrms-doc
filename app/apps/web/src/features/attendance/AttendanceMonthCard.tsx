import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "../../components/ui/Card";
import type { AttendanceDay } from "../../lib/api/types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DOT_TONE: Record<string, string> = { Present: "bg-positive", Absent: "bg-negative", HalfDay: "bg-warning" };

export function AttendanceMonthCard({
  cursor,
  grid,
  byDate,
  onPrevMonth,
  onNextMonth,
}: {
  cursor: Date;
  grid: (Date | null)[];
  byDate: Map<string, AttendanceDay>;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}) {
  return (
    <Card
      title={cursor.toLocaleDateString("en-IN", { month: "long", year: "numeric", timeZone: "UTC" })}
      action={
        <div className="flex gap-1">
          <button type="button" aria-label="Previous month" onClick={onPrevMonth} className="rounded-lg p-1.5 hover:bg-canvas">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button type="button" aria-label="Next month" onClick={onNextMonth} className="rounded-lg p-1.5 hover:bg-canvas">
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
          const day = key ? byDate.get(key) : undefined;
          return (
            <div
              key={i}
              className={`flex h-16 flex-col items-center justify-start rounded-lg border p-1 text-sm ${
                date ? "border-border" : "border-transparent"
              }`}
            >
              {date && <span>{date.getUTCDate()}</span>}
              {day && <span title={day.status} className={`mt-1 h-1.5 w-1.5 rounded-full ${DOT_TONE[day.status] ?? "bg-ink-faint"}`} />}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
