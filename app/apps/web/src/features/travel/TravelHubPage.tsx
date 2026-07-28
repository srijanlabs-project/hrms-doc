import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { useAuth } from "../auth/AuthProvider";
import {
  approveTravelRequest,
  cancelTravelRequest,
  listAllTravelRequests,
  listMyTravelRequests,
  listTeamTravelRequests,
  markTravelRequestCompleted,
  rejectTravelRequest,
} from "../../lib/api/travel";
import { NewTravelRequestForm } from "./NewTravelRequestForm";
import { TravelAdvanceAdminPanel } from "./TravelAdvanceAdminPanel";
import { TravelRequestDetailPanel } from "./TravelRequestDetailPanel";
import { TravelRequestRow } from "./TravelRequestRow";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/**
 * T-005 Smart Form + T-007 Approval -> Travel Requests. Deepened per Wave 3
 * E16 gap closure with trip planning/itinerary, travel advances, and live
 * expense settlement — see schema.prisma's TravelRequest comment for what
 * else is deferred (booking-tool integration has no vendor infra).
 */
export function TravelHubPage() {
  const { user } = useAuth();
  const isAdmin = ADMIN_ROLES.some((role) => user?.roles.includes(role));
  const queryClient = useQueryClient();

  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const myRequests = useQuery({ queryKey: ["travel-requests-my"], queryFn: listMyTravelRequests });
  const teamRequests = useQuery({
    queryKey: ["travel-requests-team", isAdmin],
    queryFn: isAdmin ? listAllTravelRequests : listTeamTravelRequests,
  });

  const invalidateMine = () => queryClient.invalidateQueries({ queryKey: ["travel-requests-my"] });
  const invalidateTeam = () => queryClient.invalidateQueries({ queryKey: ["travel-requests-team"] });

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

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Travel Requests</h1>
        <p className="text-ink-muted">Request business travel and track its approval.</p>
      </header>

      <NewTravelRequestForm />

      <Card title="My Requests">
        {myRequests.data?.length === 0 && <p className="text-ink-muted">No requests yet — submit one above.</p>}
        <ul className="space-y-2">
          {myRequests.data?.map((request) => (
            <TravelRequestRow
              key={request.id}
              request={request}
              isSelected={selectedRequestId === request.id}
              onCancel={(id) => cancelMutation.mutate(id)}
              onManage={(id) => setSelectedRequestId(selectedRequestId === id ? null : id)}
            />
          ))}
        </ul>
      </Card>

      {selectedRequestId && <TravelRequestDetailPanel travelRequestId={selectedRequestId} />}

      {isAdmin && <TravelAdvanceAdminPanel />}

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
