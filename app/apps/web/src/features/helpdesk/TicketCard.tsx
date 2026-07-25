import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import {
  addTicketComment,
  assignTicket,
  closeTicket,
  getTicket,
  reopenTicket,
  resolveTicket,
  startTicketProgress,
} from "../../lib/api/helpdesk";
import { ApiError } from "../../lib/api/http";
import type { Employee, Ticket } from "../../lib/api/types";
import { priorityTone, ticketStatusTone } from "./status-tone";
import { TicketActions } from "./TicketActions";

interface TicketCardProps {
  ticket: Ticket;
  isAdmin: boolean;
  agents?: Employee[];
}

/** Shared ticket row: expands to show the comment thread + status-appropriate actions for both self-service and admin callers. */
export function TicketCard({ ticket, isAdmin, agents }: TicketCardProps) {
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(false);
  const [commentBody, setCommentBody] = useState("");
  const [isInternal, setIsInternal] = useState(false);

  const detail = useQuery({
    queryKey: ["ticket", ticket.id],
    queryFn: () => getTicket(ticket.id),
    enabled: expanded,
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["ticket", ticket.id] });
    void queryClient.invalidateQueries({ queryKey: ["tickets-my"] });
    void queryClient.invalidateQueries({ queryKey: ["tickets-admin"] });
  };

  const comment = useMutation({
    mutationFn: () => addTicketComment(ticket.id, { body: commentBody, isInternal }),
    onSuccess: () => {
      invalidate();
      setCommentBody("");
      setIsInternal(false);
    },
  });
  const assign = useMutation({
    mutationFn: (agentEmployeeId: string) => assignTicket(ticket.id, agentEmployeeId),
    onSuccess: invalidate,
  });
  const startProgress = useMutation({ mutationFn: () => startTicketProgress(ticket.id), onSuccess: invalidate });
  const resolve = useMutation({ mutationFn: () => resolveTicket(ticket.id), onSuccess: invalidate });
  const close = useMutation({
    mutationFn: (satisfactionRating?: number) => closeTicket(ticket.id, { satisfactionRating }),
    onSuccess: invalidate,
  });
  const reopen = useMutation({ mutationFn: () => reopenTicket(ticket.id), onSuccess: invalidate });

  const errorMessage = [comment, assign, startProgress, resolve, close, reopen]
    .map((m) => m.error)
    .find((e) => e instanceof ApiError)?.message;

  return (
    <li className="rounded-lg border border-border p-3">
      <button type="button" className="flex w-full items-center justify-between text-left" onClick={() => setExpanded((v) => !v)}>
        <span>
          <span className="font-medium">{ticket.subject}</span>
          <span className="ml-2 text-xs text-ink-faint">
            {ticket.queue} · {ticket.category} · {ticket.employee.legalName}
          </span>
        </span>
        <span className="flex items-center gap-1.5">
          {ticket.isEscalated && <Badge tone="negative">Escalated</Badge>}
          <Badge tone={priorityTone(ticket.priority)}>{ticket.priority}</Badge>
          <Badge tone={ticketStatusTone(ticket.status)}>{ticket.status}</Badge>
        </span>
      </button>

      {expanded && (
        <div className="mt-3 space-y-3 border-t border-border pt-3">
          {errorMessage && <p className="rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
          <p className="text-sm text-ink-muted">{ticket.description}</p>
          {ticket.assignedAgent && <p className="text-xs text-ink-faint">Assigned to {ticket.assignedAgent.legalName}</p>}
          {ticket.dueAt && <p className="text-xs text-ink-faint">Due {new Date(ticket.dueAt).toLocaleString("en-IN")}</p>}

          <ul className="space-y-1.5">
            {detail.data?.comments.map((c) => (
              <li key={c.id} className={`rounded-lg p-2 text-sm ${c.isInternal ? "bg-warning-soft" : "bg-canvas"}`}>
                {c.isInternal && <span className="mr-1 text-xs font-semibold text-warning">Internal note ·</span>}
                {c.body}
              </li>
            ))}
          </ul>

          <form
            className="flex items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              comment.mutate();
            }}
          >
            <input
              required
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              placeholder="Add a comment…"
              className="input flex-1"
            />
            {isAdmin && (
              <label className="flex items-center gap-1 text-xs text-ink-muted">
                <input type="checkbox" checked={isInternal} onChange={(e) => setIsInternal(e.target.checked)} />
                Internal
              </label>
            )}
            <button
              type="submit"
              disabled={comment.isPending}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-primary disabled:opacity-60"
            >
              Reply
            </button>
          </form>

          <TicketActions
            ticket={ticket}
            isAdmin={isAdmin}
            agents={agents}
            assign={assign}
            startProgress={startProgress}
            resolve={resolve}
            close={(satisfactionRating) => close.mutate(satisfactionRating)}
            closePending={close.isPending}
            reopen={reopen}
          />
        </div>
      )}
    </li>
  );
}
