import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { listEmployees } from "../../lib/api/employees";
import { listAllTickets, runEscalationSweepNow, upsertSlaPolicy } from "../../lib/api/helpdesk";
import { ApiError } from "../../lib/api/http";
import { TicketCard } from "./TicketCard";

const QUEUES = ["All", "HR", "IT", "Admin", "Finance"] as const;
const STATUSES = ["All", "Open", "Assigned", "InProgress", "Resolved", "Closed"] as const;
const PRIORITIES = ["Low", "Medium", "High", "Urgent"] as const;

function SlaPolicyForm() {
  const queryClient = useQueryClient();
  const [queue, setQueue] = useState<(typeof QUEUES)[number]>("HR");
  const [priority, setPriority] = useState<(typeof PRIORITIES)[number]>("Medium");
  const [resolutionHours, setResolutionHours] = useState("");

  const save = useMutation({
    mutationFn: () => upsertSlaPolicy({ queue, priority, resolutionHours: Number(resolutionHours) }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["sla-policies"] });
      setResolutionHours("");
    },
  });
  const errorMessage = save.error instanceof ApiError ? save.error.message : undefined;

  return (
    <form
      className="mb-4 flex flex-wrap items-end gap-2 border-b border-border pb-4"
      onSubmit={(e) => {
        e.preventDefault();
        save.mutate();
      }}
    >
      {errorMessage && <p className="w-full rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      <select value={queue} onChange={(e) => setQueue(e.target.value as typeof queue)} className="input">
        {QUEUES.filter((q) => q !== "All").map((q) => (
          <option key={q} value={q}>
            {q}
          </option>
        ))}
      </select>
      <select value={priority} onChange={(e) => setPriority(e.target.value as typeof priority)} className="input">
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      <input
        required
        type="number"
        min="1"
        value={resolutionHours}
        onChange={(e) => setResolutionHours(e.target.value)}
        placeholder="Resolution hours"
        className="input w-36"
      />
      <button
        type="submit"
        disabled={save.isPending}
        className="rounded-lg border border-border px-3 py-2 text-xs font-medium hover:border-primary disabled:opacity-60"
      >
        Save SLA Policy
      </button>
    </form>
  );
}

/** Admin: ticket queue (filterable, assign/progress/resolve), SLA policies, and a manual escalation-sweep trigger. */
export function TicketQueuePanel() {
  const [queue, setQueue] = useState<(typeof QUEUES)[number]>("All");
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("All");
  const tickets = useQuery({
    queryKey: ["tickets-admin", queue, status],
    queryFn: () => listAllTickets(queue === "All" ? undefined : queue, status === "All" ? undefined : status),
  });
  const employees = useQuery({ queryKey: ["employees"], queryFn: listEmployees });
  const sweep = useMutation({ mutationFn: runEscalationSweepNow });

  return (
    <Card title="Ticket Queue">
      <SlaPolicyForm />

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <select value={queue} onChange={(e) => setQueue(e.target.value as typeof queue)} className="input">
          {QUEUES.map((q) => (
            <option key={q} value={q}>
              {q}
            </option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="input">
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={sweep.isPending}
          onClick={() => sweep.mutate()}
          className="ml-auto rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-primary disabled:opacity-60"
        >
          {sweep.isPending ? "Running…" : "Run Escalation Sweep Now"}
        </button>
      </div>

      <ul className="space-y-2">
        {tickets.data?.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} isAdmin agents={employees.data} />
        ))}
        {tickets.data?.length === 0 && <p className="text-ink-muted">No tickets match this filter.</p>}
      </ul>
    </Card>
  );
}
