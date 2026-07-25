import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import {
  addCalendarDay,
  assignCalendar,
  createWorkCalendar,
  listWorkCalendars,
  publishWorkCalendar,
} from "../../lib/api/org-settings";

const DAY_TYPES = ["Working", "Holiday", "Weekend", "Shutdown"];

/** Work calendar + holiday calendar (folded in as WorkCalendarDay rows with dayType=Holiday). */
export function WorkCalendarSection() {
  const queryClient = useQueryClient();
  const calendars = useQuery({ queryKey: ["work-calendars"], queryFn: listWorkCalendars });

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [dayCalendarId, setDayCalendarId] = useState("");
  const [date, setDate] = useState("");
  const [dayType, setDayType] = useState("Holiday");
  const [label, setLabel] = useState("");

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["work-calendars"] });

  const createMutation = useMutation({
    mutationFn: () => createWorkCalendar({ code, name }),
    onSuccess: () => {
      invalidate();
      setCode("");
      setName("");
    },
  });

  const addDayMutation = useMutation({
    mutationFn: () => addCalendarDay(dayCalendarId, { date, dayType, label: label || undefined }),
    onSuccess: () => {
      invalidate();
      setDate("");
      setLabel("");
    },
  });

  const publishMutation = useMutation({ mutationFn: (id: string) => publishWorkCalendar(id), onSuccess: invalidate });
  const assignMutation = useMutation({ mutationFn: (id: string) => assignCalendar(id, "Tenant"), onSuccess: invalidate });

  const errorMessage = createMutation.error instanceof ApiError ? createMutation.error.message : undefined;

  return (
    <Card title="Work Calendars (incl. Holiday Calendar)">
      {errorMessage && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      <form
        className="mb-3 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          createMutation.mutate();
        }}
      >
        <input
          required
          placeholder="Code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="input w-32"
        />
        <input
          required
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input flex-1 basis-40"
        />
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          Add Calendar
        </button>
      </form>

      <form
        className="mb-4 flex flex-wrap items-end gap-2 border-t border-border pt-3"
        onSubmit={(e) => {
          e.preventDefault();
          addDayMutation.mutate();
        }}
      >
        <span className="text-xs font-semibold text-ink-muted">Add day:</span>
        <select required value={dayCalendarId} onChange={(e) => setDayCalendarId(e.target.value)} className="input">
          <option value="">Select calendar</option>
          {calendars.data?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input required type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input" />
        <select value={dayType} onChange={(e) => setDayType(e.target.value)} className="input w-32">
          {DAY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <input placeholder="Label" value={label} onChange={(e) => setLabel(e.target.value)} className="input w-40" />
        <button type="submit" className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover">
          Add Day
        </button>
      </form>

      <ul className="space-y-2">
        {calendars.data?.map((c) => (
          <li key={c.id} className="rounded-lg border border-border p-3 text-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">{c.name}</span>{" "}
                <Badge tone={c.status === "Published" ? "positive" : "warning"}>{c.status}</Badge>
                <p className="mt-1 text-xs text-ink-faint">
                  {c.days.length === 0
                    ? "No days added yet"
                    : c.days
                        .map((d) => `${new Date(d.date).toLocaleDateString("en-IN")} (${d.dayType}${d.label ? `: ${d.label}` : ""})`)
                        .join(", ")}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                {c.status === "Draft" && (
                  <button
                    type="button"
                    onClick={() => publishMutation.mutate(c.id)}
                    className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
                  >
                    Publish
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => assignMutation.mutate(c.id)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover"
                >
                  Assign Tenant-wide
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
