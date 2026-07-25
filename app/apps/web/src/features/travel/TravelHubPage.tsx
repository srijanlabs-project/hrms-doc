import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { useAuth } from "../auth/AuthProvider";
import { ApiError } from "../../lib/api/http";
import {
  approveTravelRequest,
  cancelTravelRequest,
  createTravelRequest,
  listAllTravelRequests,
  listMyTravelRequests,
  listTeamTravelRequests,
  markTravelRequestCompleted,
  rejectTravelRequest,
} from "../../lib/api/travel";
import { TravelRequestRow } from "./TravelRequestRow";

const TRIP_TYPES = ["Business", "Training", "ClientVisit", "Relocation", "Emergency"];
const ADMIN_ROLES = ["org_admin", "hr_ops"];

/** T-005 Smart Form + T-007 Approval -> Travel Requests, v1 slice. See schema.prisma's TravelRequest comment for what's deferred. */
export function TravelHubPage() {
  const { user } = useAuth();
  const isAdmin = ADMIN_ROLES.some((role) => user?.roles.includes(role));
  const queryClient = useQueryClient();

  const myRequests = useQuery({ queryKey: ["travel-requests-my"], queryFn: listMyTravelRequests });
  const teamRequests = useQuery({
    queryKey: ["travel-requests-team", isAdmin],
    queryFn: isAdmin ? listAllTravelRequests : listTeamTravelRequests,
  });

  const [tripType, setTripType] = useState("Business");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [purpose, setPurpose] = useState("");

  const invalidateMine = () => queryClient.invalidateQueries({ queryKey: ["travel-requests-my"] });
  const invalidateTeam = () => queryClient.invalidateQueries({ queryKey: ["travel-requests-team"] });

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
      invalidateMine();
      setOrigin("");
      setDestination("");
      setStartDate("");
      setEndDate("");
      setEstimatedCost("");
      setPurpose("");
    },
  });
  const cancelMutation = useMutation({ mutationFn: (id: string) => cancelTravelRequest(id), onSuccess: invalidateMine });
  const approveMutation = useMutation({
    mutationFn: (id: string) => approveTravelRequest(id),
    onSuccess: invalidateTeam,
  });
  const rejectMutation = useMutation({ mutationFn: (id: string) => rejectTravelRequest(id), onSuccess: invalidateTeam });
  const markCompletedMutation = useMutation({
    mutationFn: (id: string) => markTravelRequestCompleted(id),
    onSuccess: () => {
      invalidateTeam();
      invalidateMine();
    },
  });

  const errorMessage = createMutation.error instanceof ApiError ? createMutation.error.message : undefined;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Travel Requests</h1>
        <p className="text-ink-muted">Request business travel and track its approval.</p>
      </header>

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
            <input
              required
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">End Date</span>
            <input
              required
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input"
            />
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

      <Card title="My Requests">
        {myRequests.data?.length === 0 && <p className="text-ink-muted">No requests yet — submit one above.</p>}
        <ul className="space-y-2">
          {myRequests.data?.map((request) => (
            <TravelRequestRow key={request.id} request={request} onCancel={(id) => cancelMutation.mutate(id)} />
          ))}
        </ul>
      </Card>

      {(teamRequests.data?.length ?? 0) > 0 && (
        <Card title={isAdmin ? "All Requests" : "Team Requests"}>
          <ul className="space-y-2">
            {teamRequests.data?.map((request) => (
              <TravelRequestRow
                key={request.id}
                request={request}
                showEmployee
                onApprove={(id) => approveMutation.mutate(id)}
                onReject={(id) => rejectMutation.mutate(id)}
                onMarkCompleted={isAdmin ? (id) => markCompletedMutation.mutate(id) : undefined}
              />
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
