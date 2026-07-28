import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import {
  addBankAccount,
  applySalaryRevision,
  approveSalaryRevision,
  getIdentityFinance,
  listSalaryRevisions,
  proposeSalaryRevision,
  rejectSalaryRevision,
  revealSensitiveField,
  upsertTaxProfile,
} from "../../lib/api/people-extras";

function statusTone(status: string) {
  if (status === "Applied") return "positive" as const;
  if (status === "Approved") return "info" as const;
  if (status === "Rejected") return "negative" as const;
  return "warning" as const;
}

/** Consolidates salary revision (ad-hoc, separate from merit cycles), bank accounts, and tax information. */
export function CompensationTab({ employeeId, isAdmin }: { employeeId: string; isAdmin: boolean }) {
  const queryClient = useQueryClient();
  const revisions = useQuery({ queryKey: ["salary-revisions", employeeId], queryFn: () => listSalaryRevisions(employeeId) });
  const identityFinance = useQuery({ queryKey: ["identity-finance", employeeId], queryFn: () => getIdentityFinance(employeeId) });

  const [proposedMonthlyBasic, setProposedMonthlyBasic] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [reason, setReason] = useState("");

  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");

  const [panNumber, setPanNumber] = useState("");

  const invalidateRevisions = () => queryClient.invalidateQueries({ queryKey: ["salary-revisions", employeeId] });
  const invalidateFinance = () => queryClient.invalidateQueries({ queryKey: ["identity-finance", employeeId] });

  const proposeMutation = useMutation({
    mutationFn: () => proposeSalaryRevision(employeeId, { proposedMonthlyBasic: Number(proposedMonthlyBasic), effectiveDate, reason: reason || undefined }),
    onSuccess: () => {
      invalidateRevisions();
      setProposedMonthlyBasic("");
      setEffectiveDate("");
      setReason("");
    },
  });
  const approveMutation = useMutation({ mutationFn: (id: string) => approveSalaryRevision(id), onSuccess: invalidateRevisions });
  const rejectMutation = useMutation({ mutationFn: (id: string) => rejectSalaryRevision(id), onSuccess: invalidateRevisions });
  const applyMutation = useMutation({ mutationFn: (id: string) => applySalaryRevision(id), onSuccess: invalidateRevisions });

  const [revealedAccountIds, setRevealedAccountIds] = useState<Record<string, string>>({});
  const revealAccountMutation = useMutation({
    mutationFn: (recordId: string) => revealSensitiveField(employeeId, "BankAccount", recordId),
    onSuccess: (result, recordId) => setRevealedAccountIds((prev) => ({ ...prev, [recordId]: result.value })),
  });

  const bankMutation = useMutation({
    mutationFn: () => addBankAccount(employeeId, { accountHolderName, accountNumber, bankName }),
    onSuccess: () => {
      invalidateFinance();
      setAccountHolderName("");
      setAccountNumber("");
      setBankName("");
    },
  });

  const taxMutation = useMutation({
    mutationFn: () => upsertTaxProfile(employeeId, { panNumber }),
    onSuccess: invalidateFinance,
  });

  return (
    <div className="space-y-4">
      {isAdmin && (
        <Card title="Propose Salary Revision">
          <form
            className="flex flex-wrap items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              proposeMutation.mutate();
            }}
          >
            <input
              required
              type="number"
              placeholder="Proposed Monthly Basic (₹)"
              value={proposedMonthlyBasic}
              onChange={(e) => setProposedMonthlyBasic(e.target.value)}
              className="input w-52"
            />
            <input required type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} className="input" />
            <input placeholder="Reason" value={reason} onChange={(e) => setReason(e.target.value)} className="input flex-1 basis-40" />
            <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover">
              Propose
            </button>
          </form>
        </Card>
      )}

      <Card title="Salary Revisions">
        <ul className="space-y-2">
          {revisions.data?.map((r) => (
            <li key={r.id} className="rounded-lg border border-border p-3 text-sm">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">₹{r.proposedMonthlyBasic.toLocaleString("en-IN")}</span> effective{" "}
                  {new Date(r.effectiveDate).toLocaleDateString("en-IN")} <Badge tone={statusTone(r.status)}>{r.status}</Badge>
                  {r.reason && <p className="mt-1 text-xs text-ink-faint">{r.reason}</p>}
                </div>
                {isAdmin && r.status === "Proposed" && (
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => approveMutation.mutate(r.id)}
                      className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => rejectMutation.mutate(r.id)}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover"
                    >
                      Reject
                    </button>
                  </div>
                )}
                {isAdmin && r.status === "Approved" && (
                  <button
                    type="button"
                    onClick={() => applyMutation.mutate(r.id)}
                    className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
                  >
                    Apply
                  </button>
                )}
              </div>
            </li>
          ))}
          {revisions.data?.length === 0 && <p className="text-xs text-ink-faint">No salary revisions yet.</p>}
        </ul>
      </Card>

      <Card title="Bank Accounts">
        <form
          className="mb-3 flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            bankMutation.mutate();
          }}
        >
          <input required placeholder="Account Holder" value={accountHolderName} onChange={(e) => setAccountHolderName(e.target.value)} className="input" />
          <input required placeholder="Account Number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="input" />
          <input required placeholder="Bank Name" value={bankName} onChange={(e) => setBankName(e.target.value)} className="input" />
          <button type="submit" className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover">
            Add Account
          </button>
        </form>
        <ul className="space-y-1">
          {identityFinance.data?.bankAccounts.map((b) => (
            <li key={b.id} className="rounded-lg border border-border p-2 text-sm">
              {b.bankName} · <span className="font-mono">{revealedAccountIds[b.id] ?? b.accountNumber}</span>{" "}
              {!revealedAccountIds[b.id] && (
                <button
                  type="button"
                  onClick={() => revealAccountMutation.mutate(b.id)}
                  className="text-xs text-primary hover:underline"
                >
                  Reveal
                </button>
              )}{" "}
              {b.isPrimary && <Badge tone="info">Primary</Badge>}
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Tax Profile">
        <form
          className="flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            taxMutation.mutate();
          }}
        >
          <input
            placeholder="PAN Number"
            defaultValue={identityFinance.data?.taxProfile?.panNumber ?? ""}
            onChange={(e) => setPanNumber(e.target.value)}
            className="input"
          />
          <button type="submit" className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover">
            Save
          </button>
        </form>
      </Card>
    </div>
  );
}
