import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { createTicket, listMyTickets } from "../../lib/api/helpdesk";
import { ApiError } from "../../lib/api/http";
import type { Ticket } from "../../lib/api/types";
import { TicketCard } from "./TicketCard";

const QUEUES = ["HR", "IT", "Admin", "Finance"] as const;
const PRIORITIES = ["Low", "Medium", "High", "Urgent"] as const;

/** Self-service: raise a ticket and track your own tickets through to resolution. */
export function MyTicketsPanel() {
  const queryClient = useQueryClient();
  const tickets = useQuery({ queryKey: ["tickets-my"], queryFn: listMyTickets });

  const [queue, setQueue] = useState<Ticket["queue"]>("HR");
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Ticket["priority"]>("Medium");

  const create = useMutation({
    mutationFn: () => createTicket({ queue, category, subject, description, priority }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["tickets-my"] });
      setCategory("");
      setSubject("");
      setDescription("");
    },
  });
  const errorMessage = create.error instanceof ApiError ? create.error.message : undefined;

  return (
    <Card title="My Tickets">
      {errorMessage && <p className="mb-3 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      <form
        className="mb-4 space-y-2 border-b border-border pb-4"
        onSubmit={(e) => {
          e.preventDefault();
          create.mutate();
        }}
      >
        <div className="flex flex-wrap gap-2">
          <select value={queue} onChange={(e) => setQueue(e.target.value as Ticket["queue"])} className="input">
            {QUEUES.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
          <input required value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" className="input w-40" />
          <select value={priority} onChange={(e) => setPriority(e.target.value as Ticket["priority"])} className="input">
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <input required value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="input w-full" />
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your issue…"
          className="input w-full"
          rows={2}
        />
        <button
          type="submit"
          disabled={create.isPending}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          {create.isPending ? "Submitting…" : "Raise Ticket"}
        </button>
      </form>

      <ul className="space-y-2">
        {tickets.data?.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} isAdmin={false} />
        ))}
        {tickets.data?.length === 0 && <p className="text-ink-muted">You have no tickets yet.</p>}
      </ul>
    </Card>
  );
}
