import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { useAuth } from "../auth/AuthProvider";
import { ApiError } from "../../lib/api/http";
import {
  approveExpenseClaim,
  cancelExpenseClaim,
  createExpenseClaim,
  listAllExpenseClaims,
  listMyExpenseClaims,
  listTeamExpenseClaims,
  markExpenseClaimPaid,
  rejectExpenseClaim,
} from "../../lib/api/expense";
import { ClaimRow } from "./ClaimRow";

const CATEGORIES = ["Travel", "Lodging", "Meals", "Transport", "OfficeSupplies", "Other"];
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

  const [category, setCategory] = useState("Travel");
  const [amount, setAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [merchant, setMerchant] = useState("");
  const [businessPurpose, setBusinessPurpose] = useState("");

  const invalidateMine = () => queryClient.invalidateQueries({ queryKey: ["expense-claims-my"] });
  const invalidateTeam = () => queryClient.invalidateQueries({ queryKey: ["expense-claims-team"] });

  const createMutation = useMutation({
    mutationFn: () =>
      createExpenseClaim({
        category,
        amount: Number(amount),
        expenseDate,
        merchant: merchant || undefined,
        businessPurpose: businessPurpose || undefined,
      }),
    onSuccess: () => {
      invalidateMine();
      setAmount("");
      setExpenseDate("");
      setMerchant("");
      setBusinessPurpose("");
    },
  });
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

  const errorMessage = createMutation.error instanceof ApiError ? createMutation.error.message : undefined;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Expense Claims</h1>
        <p className="text-ink-muted">Submit business expenses and track their approval.</p>
      </header>

      <Card title="New Claim">
        {errorMessage && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
        <form
          className="flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate();
          }}
        >
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Category</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="input w-40">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Amount (₹)</span>
            <input
              required
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input w-32"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Expense Date</span>
            <input
              required
              type="date"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              className="input"
            />
          </label>
          <label className="block flex-1 basis-40">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Merchant</span>
            <input value={merchant} onChange={(e) => setMerchant(e.target.value)} className="input" />
          </label>
          <label className="block flex-1 basis-52">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Business Purpose</span>
            <input value={businessPurpose} onChange={(e) => setBusinessPurpose(e.target.value)} className="input" />
          </label>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
          >
            {createMutation.isPending ? "Submitting…" : "Submit Claim"}
          </button>
        </form>
      </Card>

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
    </div>
  );
}
