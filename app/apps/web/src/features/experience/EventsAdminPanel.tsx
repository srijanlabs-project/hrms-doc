import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { createEvent, listAllEventsAdmin, publishEvent } from "../../lib/api/experience";
import { ApiError } from "../../lib/api/http";

/** Admin: create and publish company/team events. */
export function EventsAdminPanel() {
  const queryClient = useQueryClient();
  const events = useQuery({ queryKey: ["events-admin"], queryFn: listAllEventsAdmin });
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [startAt, setStartAt] = useState("");

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["events-admin"] });
    void queryClient.invalidateQueries({ queryKey: ["events-upcoming"] });
  };
  const create = useMutation({
    mutationFn: () => createEvent({ title, location, startAt }),
    onSuccess: () => {
      invalidate();
      setTitle("");
      setLocation("");
      setStartAt("");
    },
  });
  const publish = useMutation({ mutationFn: (id: string) => publishEvent(id), onSuccess: invalidate });
  const errorMessage = create.error instanceof ApiError ? create.error.message : undefined;

  return (
    <Card title="Events (Admin)">
      {errorMessage && <p className="mb-3 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      <form
        className="mb-4 flex flex-wrap items-end gap-2 border-b border-border pb-4"
        onSubmit={(e) => {
          e.preventDefault();
          create.mutate();
        }}
      >
        <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="input flex-1" />
        <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" className="input w-40" />
        <input required type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} className="input" />
        <button
          type="submit"
          disabled={create.isPending}
          className="rounded-lg border border-border px-3 py-2 text-xs font-medium hover:border-primary disabled:opacity-60"
        >
          Create Draft
        </button>
      </form>

      <ul className="space-y-2">
        {events.data?.map((e) => (
          <li key={e.id} className="rounded-lg border border-border p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">{e.title}</span>
              <span className="flex items-center gap-1.5">
                <Badge tone="neutral">{e._count.rsvps} RSVPs</Badge>
                <Badge tone={e.status === "Published" ? "positive" : "warning"}>{e.status}</Badge>
              </span>
            </div>
            {e.status === "Draft" && (
              <button
                type="button"
                disabled={publish.isPending}
                onClick={() => publish.mutate(e.id)}
                className="mt-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
              >
                Publish
              </button>
            )}
          </li>
        ))}
        {events.data?.length === 0 && <p className="text-ink-muted">No events yet.</p>}
      </ul>
    </Card>
  );
}
