import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { cancelBooking, createBooking, listActiveResources, listMyBookings } from "../../lib/api/workplace";
import { bookingStatusTone } from "./status-tone";

/** Self-service: book a desk/room/parking/shuttle/cafeteria resource for a date, capacity-checked server-side. */
export function BookingPanel() {
  const queryClient = useQueryClient();
  const resources = useQuery({ queryKey: ["workplace-resources"], queryFn: listActiveResources });
  const bookings = useQuery({ queryKey: ["workplace-bookings-mine"], queryFn: listMyBookings });

  const [resourceId, setResourceId] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [notes, setNotes] = useState("");

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["workplace-bookings-mine"] });
  const createMutation = useMutation({
    mutationFn: () => createBooking({ resourceId, bookingDate, notes: notes || undefined }),
    onSuccess: () => {
      setResourceId("");
      setBookingDate("");
      setNotes("");
      invalidate();
    },
  });
  const cancelMutation = useMutation({ mutationFn: (id: string) => cancelBooking(id), onSuccess: invalidate });

  return (
    <Card title="Book a Workplace Resource">
      {createMutation.error instanceof ApiError && (
        <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{createMutation.error.message}</p>
      )}
      <form
        className="mb-4 flex flex-wrap items-end gap-2 border-b border-border pb-4"
        onSubmit={(e) => {
          e.preventDefault();
          createMutation.mutate();
        }}
      >
        <select required value={resourceId} onChange={(e) => setResourceId(e.target.value)} className="input">
          <option value="">Select resource…</option>
          {resources.data?.map((r) => (
            <option key={r.id} value={r.id}>
              {r.type}: {r.name}
            </option>
          ))}
        </select>
        <input required type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} className="input" />
        <input placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="input" />
        <button type="submit" className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-hover">
          Book
        </button>
        {resources.data?.length === 0 && <span className="text-xs text-ink-faint">No active resources to book.</span>}
      </form>

      <h3 className="mb-2 text-sm font-semibold">My Bookings</h3>
      <ul className="space-y-1">
        {bookings.data?.map((b) => (
          <li key={b.id} className="flex items-center justify-between rounded-lg border border-border p-2 text-sm">
            <span>
              {b.resource.type}: {b.resource.name} — {new Date(b.bookingDate).toLocaleDateString("en-IN")}{" "}
              <Badge tone={bookingStatusTone(b.status)}>{b.status}</Badge>
            </span>
            {b.status === "Confirmed" && (
              <button
                type="button"
                onClick={() => cancelMutation.mutate(b.id)}
                className="rounded-lg border border-border px-2 py-1 text-xs font-semibold hover:bg-surface-hover"
              >
                Cancel
              </button>
            )}
          </li>
        ))}
        {bookings.data?.length === 0 && <p className="text-sm text-ink-faint">No bookings yet.</p>}
      </ul>
    </Card>
  );
}
