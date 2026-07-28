import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { addItinerarySegment, listItinerarySegments, removeItinerarySegment } from "../../lib/api/travel";
import { ApiError } from "../../lib/api/http";
import type { TravelItinerarySegment } from "../../lib/api/types";

const MODES: TravelItinerarySegment["mode"][] = ["Flight", "Train", "Bus", "Car", "Hotel", "Other"];

/** Self-service: leg-by-leg trip itinerary. Planning a trip IS building its itinerary — see schema.prisma's comment. */
export function TravelItineraryPanel({ travelRequestId }: { travelRequestId: string }) {
  const queryClient = useQueryClient();
  const segments = useQuery({
    queryKey: ["travel-itinerary", travelRequestId],
    queryFn: () => listItinerarySegments(travelRequestId),
  });

  const [mode, setMode] = useState<TravelItinerarySegment["mode"]>("Flight");
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [departAt, setDepartAt] = useState("");
  const [bookingReference, setBookingReference] = useState("");

  const invalidate = () => void queryClient.invalidateQueries({ queryKey: ["travel-itinerary", travelRequestId] });
  const nextSequence = (segments.data?.length ?? 0) + 1;

  const add = useMutation({
    mutationFn: () =>
      addItinerarySegment(travelRequestId, {
        sequence: nextSequence,
        mode,
        fromLocation,
        toLocation,
        departAt,
        bookingReference: bookingReference || undefined,
      }),
    onSuccess: () => {
      invalidate();
      setFromLocation("");
      setToLocation("");
      setDepartAt("");
      setBookingReference("");
    },
  });
  const remove = useMutation({ mutationFn: (segmentId: string) => removeItinerarySegment(travelRequestId, segmentId), onSuccess: invalidate });
  const errorMessage = add.error instanceof ApiError ? add.error.message : undefined;

  return (
    <Card title="Itinerary">
      {errorMessage && <p className="mb-3 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      <form
        className="mb-4 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          add.mutate();
        }}
      >
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Mode</span>
          <select value={mode} onChange={(e) => setMode(e.target.value as typeof mode)} className="input">
            {MODES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <label className="block flex-1 basis-32">
          <span className="mb-1 block text-xs font-medium text-ink-muted">From</span>
          <input required value={fromLocation} onChange={(e) => setFromLocation(e.target.value)} className="input" />
        </label>
        <label className="block flex-1 basis-32">
          <span className="mb-1 block text-xs font-medium text-ink-muted">To</span>
          <input required value={toLocation} onChange={(e) => setToLocation(e.target.value)} className="input" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Depart</span>
          <input required type="datetime-local" value={departAt} onChange={(e) => setDepartAt(e.target.value)} className="input" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Booking Ref.</span>
          <input value={bookingReference} onChange={(e) => setBookingReference(e.target.value)} className="input w-32" />
        </label>
        <button
          type="submit"
          disabled={add.isPending}
          className="rounded-lg border border-border px-3 py-2 text-xs font-medium hover:border-primary disabled:opacity-60"
        >
          Add Leg
        </button>
      </form>

      <ol className="space-y-2">
        {segments.data?.map((s) => (
          <li key={s.id} className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <span className="font-medium">
                {s.sequence}. {s.mode}: {s.fromLocation} → {s.toLocation}
              </span>
              <p className="text-xs text-ink-faint">
                {new Date(s.departAt).toLocaleString("en-IN")}
                {s.bookingReference && ` · Ref: ${s.bookingReference}`}
              </p>
            </div>
            <button
              type="button"
              disabled={remove.isPending}
              onClick={() => remove.mutate(s.id)}
              className="rounded-lg border border-border px-3 py-1 text-xs font-medium hover:border-negative hover:text-negative"
            >
              Remove
            </button>
          </li>
        ))}
        {segments.data?.length === 0 && <p className="text-ink-muted">No itinerary legs yet — add one above.</p>}
      </ol>
    </Card>
  );
}
