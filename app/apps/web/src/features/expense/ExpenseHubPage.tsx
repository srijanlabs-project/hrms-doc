import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "../../components/ui/Card";
import { useAuth } from "../auth/AuthProvider";
import {
  approveExpenseClaim,
  cancelExpenseClaim,
  listAllExpenseClaims,
  listMyExpenseClaims,
  listTeamExpenseClaims,
  markExpenseClaimPaid,
  rejectExpenseClaim,
} from "../../lib/api/expense";
import { ClaimRow } from "./ClaimRow";
import { NewExpenseClaimForm } from "./NewExpenseClaimForm";
import { PerDiemPanel } from "./PerDiemPanel";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/** T-005 Smart Form + T-007 Approval -> Expense Claims, v1 slice. See schema.prisma's ExpenseClaim comment for what's deferred. */
export function ExpenseHubPage() {
  const { user } = useAuth();
  const isAdmin = ADMIN_ROLES.some((role) => user?.roles.includes(role));
  const queryClient = useQueryClient();

  const myClaims = useQuery({ queryKey: ["expense-claims-my"], queryFn: listMyExpenseClaims });
  const teamClaims = useQuery({
    queryKey: ["expense-claims-team", isAdmin],
    queryFn: isAdmin ? listAllExpenseClaims : listTeamExpenseClaims,
  });

  const invalidateMine = () => queryClient.invalidateQueries({ queryKey: ["expense-claims-my"] });
  const invalidateTeam = () => queryClient.invalidateQueries({ queryKey: ["expense-claims-team"] });

  const cancelMutation = useMutation({ mutationFn: (id: string) => cancelExpenseClaim(id), onSuccess: invalidateMine });
  const approveMutation = useMutation({
    mutationFn: (id: string) => approveExpenseClaim(id),
    onSuccess: invalidateTeam,
  });
  const rejectMutation = useMutation({ mutationFn: (id: string) => rejectExpenseClaim(id), onSuccess: invalidateTeam });
  const markPaidMutation = useMutation({
    mutationFn: (id: string) => markExpenseClaimPaid(id),
    onSuccess: () => {
      invalidateTeam();
      invalidateMine();
    },
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Expense Claims</h1>
        <p className="text-ink-muted">Submit business expenses and track their approval.</p>
      </header>

      <NewExpenseClaimForm />

      <Card title="My Claims">
        {myClaims.data?.length === 0 && <p className="text-ink-muted">No claims yet — submit one above.</p>}
        <ul className="space-y-2">
          {myClaims.data?.map((claim) => (
            <ClaimRow key={claim.id} claim={claim} onCancel={(id) => cancelMutation.mutate(id)} />
          ))}
        </ul>
      </Card>

      {(teamClaims.data?.length ?? 0) > 0 && (
        <Card title={isAdmin ? "All Claims" : "Team Claims"}>
          <ul className="space-y-2">
            {teamClaims.data?.map((claim) => (
              <ClaimRow
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

      <header>
        <h2 className="text-xl font-bold">Per Diem</h2>
        <p className="text-ink-muted">Claim daily allowances against configured per diem policies.</p>
      </header>
      <PerDiemPanel />
    </div>
  );
}
