import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "../../components/ui/Card";
import { useAuth } from "../auth/AuthProvider";
import {
  approvePerDiemClaim,
  listAllPerDiemClaims,
  listMyPerDiemClaims,
  listTeamPerDiemClaims,
  markPerDiemClaimPaid,
  rejectPerDiemClaim,
} from "../../lib/api/per-diem";
import { NewPerDiemClaimForm } from "./NewPerDiemClaimForm";
import { PerDiemClaimRow } from "./PerDiemClaimRow";
import { PerDiemPolicyAdminPanel } from "./PerDiemPolicyAdminPanel";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/** Wave 3 W4·E17 gap closure ("per diem"). Claim lifecycle UI mirrors the Expense Claims cards above. */
export function PerDiemPanel() {
  const { user } = useAuth();
  const isAdmin = ADMIN_ROLES.some((role) => user?.roles.includes(role));
  const queryClient = useQueryClient();

  const myClaims = useQuery({ queryKey: ["per-diem-claims-my"], queryFn: listMyPerDiemClaims });
  const teamClaims = useQuery({
    queryKey: ["per-diem-claims-team", isAdmin],
    queryFn: isAdmin ? listAllPerDiemClaims : listTeamPerDiemClaims,
  });

  const invalidateTeam = () => queryClient.invalidateQueries({ queryKey: ["per-diem-claims-team"] });
  const invalidateMine = () => queryClient.invalidateQueries({ queryKey: ["per-diem-claims-my"] });

  const approveMutation = useMutation({ mutationFn: (id: string) => approvePerDiemClaim(id), onSuccess: invalidateTeam });
  const rejectMutation = useMutation({ mutationFn: (id: string) => rejectPerDiemClaim(id), onSuccess: invalidateTeam });
  const markPaidMutation = useMutation({
    mutationFn: (id: string) => markPerDiemClaimPaid(id),
    onSuccess: () => {
      invalidateTeam();
      invalidateMine();
    },
  });

  return (
    <div className="space-y-6">
      {isAdmin && <PerDiemPolicyAdminPanel />}

      <NewPerDiemClaimForm />

      <Card title="My Per Diem Claims">
        {myClaims.data?.length === 0 && <p className="text-ink-muted">No per diem claims yet — submit one above.</p>}
        <ul className="space-y-2">
          {myClaims.data?.map((claim) => (
            <PerDiemClaimRow key={claim.id} claim={claim} />
          ))}
        </ul>
      </Card>

      {(teamClaims.data?.length ?? 0) > 0 && (
        <Card title={isAdmin ? "All Per Diem Claims" : "Team Per Diem Claims"}>
          <ul className="space-y-2">
            {teamClaims.data?.map((claim) => (
              <PerDiemClaimRow
                key={claim.id}
                claim={claim}
                showEmployee
                onApprove={(id) => approveMutation.mutate(id)}
                onReject={(id) => rejectMutation.mutate(id)}
                onMarkPaid={isAdmin ? (id) => markPaidMutation.mutate(id) : undefined}
              />
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
