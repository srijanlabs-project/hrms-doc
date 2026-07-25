import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { listMyReferrals, listOpenRequisitionsForReferral, submitReferral } from "../../lib/api/recruitment";
import { applicationStageTone } from "./status-tone";

/**
 * Employee Referrals — a real catalog gap (not covered by any deep-spec
 * file). Any employee can refer a candidate for a currently Published
 * requisition; no referral-bonus payout tracking, since that depends on a
 * benefits/payroll linkage this pass doesn't build.
 */
export function ReferralPage() {
  const queryClient = useQueryClient();
  const openRequisitions = useQuery({ queryKey: ["referral-requisitions"], queryFn: listOpenRequisitionsForReferral });
  const myReferrals = useQuery({ queryKey: ["my-referrals"], queryFn: listMyReferrals });

  const [requisitionId, setRequisitionId] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const submit = useMutation({
    mutationFn: () => submitReferral({ requisitionId, fullName, email }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["my-referrals"] });
      setRequisitionId("");
      setFullName("");
      setEmail("");
    },
  });
  const errorMessage = submit.error instanceof ApiError ? submit.error.message : undefined;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Refer a Candidate</h1>
        <p className="text-ink-muted">Know someone great for one of our open roles? Refer them here.</p>
      </header>

      <Card title="Submit a Referral">
        {errorMessage && <p className="mb-3 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
        <form
          className="flex flex-wrap items-end gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            submit.mutate();
          }}
        >
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Open Role</span>
            <select
              required
              value={requisitionId}
              onChange={(e) => setRequisitionId(e.target.value)}
              className="input w-64"
            >
              <option value="">Select a role…</option>
              {openRequisitions.data?.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} ({r.headcount} opening{r.headcount === 1 ? "" : "s"})
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Candidate Full Name</span>
            <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className="input" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Candidate Email</span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
          </label>
          <button
            type="submit"
            disabled={submit.isPending}
            className="rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
          >
            {submit.isPending ? "Submitting…" : "Submit Referral"}
          </button>
        </form>
        {openRequisitions.data?.length === 0 && (
          <p className="mt-3 text-sm text-ink-muted">There are no open roles accepting referrals right now.</p>
        )}
      </Card>

      <Card title="My Referrals">
        <ul className="space-y-2">
          {myReferrals.data?.map((candidate) => (
            <li key={candidate.id} className="rounded-lg border border-border p-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="font-medium">{candidate.fullName}</div>
                  <div className="text-xs text-ink-faint">{candidate.email}</div>
                </div>
                <div className="flex flex-wrap justify-end gap-1">
                  {candidate.applications.map((app) => (
                    <span key={app.id} className="flex items-center gap-1 text-xs text-ink-muted">
                      {app.requisition.title}
                      <Badge tone={applicationStageTone(app.stage)}>{app.stage}</Badge>
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
        {myReferrals.data?.length === 0 && <p className="text-ink-muted">You haven't referred any candidates yet.</p>}
      </Card>
    </div>
  );
}
