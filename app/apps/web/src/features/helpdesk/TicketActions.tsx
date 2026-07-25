import { useState } from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import type { Employee, Ticket } from "../../lib/api/types";

interface TicketActionsProps {
  ticket: Ticket;
  isAdmin: boolean;
  agents?: Employee[];
  assign: UseMutationResult<Ticket, unknown, string>;
  startProgress: UseMutationResult<Ticket, unknown, void>;
  resolve: UseMutationResult<Ticket, unknown, void>;
  close: (satisfactionRating?: number) => void;
  closePending: boolean;
  reopen: UseMutationResult<Ticket, unknown, void>;
}

/** Status-appropriate action controls for a ticket — extracted from TicketCard to stay under the per-function line limit. */
export function TicketActions({ ticket, isAdmin, agents, assign, startProgress, resolve, close, closePending, reopen }: TicketActionsProps) {
  const [agentId, setAgentId] = useState("");
  const [satisfactionRating, setSatisfactionRating] = useState("");

  return (
    <div className="flex flex-wrap items-center gap-2">
      {isAdmin && ticket.status === "Open" && (
        <>
          <select value={agentId} onChange={(e) => setAgentId(e.target.value)} className="input w-40">
            <option value="">Select agent…</option>
            {agents?.map((a) => (
              <option key={a.id} value={a.id}>
                {a.legalName}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={!agentId || assign.isPending}
            onClick={() => assign.mutate(agentId)}
            className="rounded-lg border border-border px-3 py-1 text-xs font-medium hover:border-primary disabled:opacity-60"
          >
            Assign
          </button>
        </>
      )}
      {isAdmin && ticket.status === "Assigned" && (
        <button
          type="button"
          disabled={startProgress.isPending}
          onClick={() => startProgress.mutate()}
          className="rounded-lg border border-border px-3 py-1 text-xs font-medium hover:border-primary disabled:opacity-60"
        >
          Start Progress
        </button>
      )}
      {isAdmin && (ticket.status === "Assigned" || ticket.status === "InProgress") && (
        <button
          type="button"
          disabled={resolve.isPending}
          onClick={() => resolve.mutate()}
          className="rounded-lg border border-border px-3 py-1 text-xs font-medium hover:border-primary disabled:opacity-60"
        >
          Mark Resolved
        </button>
      )}
      {ticket.status === "Resolved" && (
        <>
          {!isAdmin && (
            <select value={satisfactionRating} onChange={(e) => setSatisfactionRating(e.target.value)} className="input w-32">
              <option value="">Rate (1-5)</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          )}
          <button
            type="button"
            disabled={closePending}
            onClick={() => close(satisfactionRating ? Number(satisfactionRating) : undefined)}
            className="rounded-lg border border-border px-3 py-1 text-xs font-medium hover:border-primary disabled:opacity-60"
          >
            Close
          </button>
        </>
      )}
      {!isAdmin && ticket.status === "Closed" && (
        <button
          type="button"
          disabled={reopen.isPending}
          onClick={() => reopen.mutate()}
          className="rounded-lg border border-border px-3 py-1 text-xs font-medium hover:border-negative hover:text-negative disabled:opacity-60"
        >
          Reopen
        </button>
      )}
      {ticket.satisfactionRating != null && <span className="text-xs text-ink-faint">Rated {ticket.satisfactionRating}/5</span>}
    </div>
  );
}
