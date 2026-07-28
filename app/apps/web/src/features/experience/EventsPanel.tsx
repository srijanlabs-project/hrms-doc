import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { getMyRsvp, listUpcomingEvents, rsvpToEvent } from "../../lib/api/experience";
import type { EventRsvp, ExperienceEvent } from "../../lib/api/types";

const RESPONSES: EventRsvp["response"][] = ["Going", "Interested", "Declined"];

function EventRow({ event }: { event: ExperienceEvent }) {
  const queryClient = useQueryClient();
  const myRsvp = useQuery({ queryKey: ["event-rsvp-mine", event.id], queryFn: () => getMyRsvp(event.id) });
  const rsvp = useMutation({
    mutationFn: (response: EventRsvp["response"]) => rsvpToEvent(event.id, response),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["event-rsvp-mine", event.id] }),
  });

  return (
    <li className="rounded-lg border border-border p-3">
      <div className="flex items-center justify-between">
        <span className="font-medium">{event.title}</span>
        <Badge tone="info">{new Date(event.startAt).toLocaleString("en-IN")}</Badge>
      </div>
      {event.description && <p className="mt-1 text-sm text-ink-muted">{event.description}</p>}
      {event.location && <p className="mt-1 text-xs text-ink-faint">📍 {event.location}</p>}
      <div className="mt-2 flex gap-2">
        {RESPONSES.map((r) => (
          <button
            key={r}
            type="button"
            disabled={rsvp.isPending}
            onClick={() => rsvp.mutate(r)}
            className={`rounded-lg px-3 py-1 text-xs font-medium disabled:opacity-60 ${
              myRsvp.data?.response === r ? "bg-primary text-white" : "border border-border hover:border-primary"
            }`}
          >
            {r}
          </button>
        ))}
      </div>
    </li>
  );
}

/** Self-service: upcoming published events with RSVP. */
export function EventsPanel() {
  const events = useQuery({ queryKey: ["events-upcoming"], queryFn: listUpcomingEvents });

  return (
    <Card title="Upcoming Events">
      <ul className="space-y-2">
        {events.data?.map((e) => (
          <EventRow key={e.id} event={e} />
        ))}
        {events.data?.length === 0 && <p className="text-ink-muted">No upcoming events.</p>}
      </ul>
    </Card>
  );
}
