import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { createTravelRequest } from "../../lib/api/travel";

const TRIP_TYPES = ["Business", "Training", "ClientVisit", "Relocation", "Emergency"];

export function NewTravelRequestForm() {
  const queryClient = useQueryClient();
  const [tripType, setTripType] = useState("Business");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [purpose, setPurpose] = useState("");

  const createMutation = useMutation({
    mutationFn: () =>
      createTravelRequest({
        tripType,
        origin,
        destination,
        startDate,
        endDate,
        estimatedCost: estimatedCost ? Number(estimatedCost) : undefined,
        purpose: purpose || undefined,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["travel-requests-my"] });
      setOrigin("");
      setDestination("");
      setStartDate("");
      setEndDate("");
      setEstimatedCost("");
      setPurpose("");
    },
  });
  const errorMessage = createMutation.error instanceof ApiError ? createMutation.error.message : undefined;

  return (
    <Card title="New Request">
      {errorMessage && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      <form
        className="flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          createMutation.mutate();
        }}
      >
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Trip Type</span>
          <select value={tripType} onChange={(e) => setTripType(e.target.value)} className="input w-36">
            {TRIP_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="block flex-1 basis-32">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Origin</span>
          <input required value={origin} onChange={(e) => setOrigin(e.target.value)} className="input" />
        </label>
        <label className="block flex-1 basis-32">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Destination</span>
          <input required value={destination} onChange={(e) => setDestination(e.target.value)} className="input" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Start Date</span>
          <input required type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">End Date</span>
          <input required type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Est. Cost (₹)</span>
          <input
            type="number"
            min="1"
            value={estimatedCost}
            onChange={(e) => setEstimatedCost(e.target.value)}
            className="input w-28"
          />
        </label>
        <label className="block flex-1 basis-52">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Purpose</span>
          <input value={purpose} onChange={(e) => setPurpose(e.target.value)} className="input" />
        </label>
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          {createMutation.isPending ? "Submitting…" : "Submit Request"}
        </button>
      </form>
    </Card>
  );
}
