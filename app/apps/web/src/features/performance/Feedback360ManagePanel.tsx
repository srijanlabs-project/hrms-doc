import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { listEmployees } from "../../lib/api/employees";
import { ApiError } from "../../lib/api/http";
import {
  closeFeedbackCampaign,
  createFeedbackCampaign,
  listFeedbackCampaignsForSubject,
  nominateRater,
  openFeedbackCampaign,
} from "../../lib/api/performance";
import type { FeedbackCampaign } from "../../lib/api/types";

const RATER_CATEGORIES = ["Manager", "Peer", "DirectReport", "Self"] as const;

function CampaignRow({ campaign, subjectEmployeeId }: { campaign: FeedbackCampaign; subjectEmployeeId: string }) {
  const queryClient = useQueryClient();
  const employees = useQuery({ queryKey: ["employees"], queryFn: listEmployees });
  const [raterId, setRaterId] = useState("");
  const [category, setCategory] = useState<(typeof RATER_CATEGORIES)[number]>("Peer");

  const invalidate = () =>
    void queryClient.invalidateQueries({ queryKey: ["feedback360-campaigns", subjectEmployeeId] });

  const nominate = useMutation({
    mutationFn: () => nominateRater(campaign.id, { raterEmployeeId: raterId, category }),
    onSuccess: () => {
      invalidate();
      setRaterId("");
    },
  });
  const open = useMutation({ mutationFn: () => openFeedbackCampaign(campaign.id), onSuccess: invalidate });
  const close = useMutation({ mutationFn: () => closeFeedbackCampaign(campaign.id), onSuccess: invalidate });
  const errorMessage =
    nominate.error instanceof ApiError
      ? nominate.error.message
      : open.error instanceof ApiError
        ? open.error.message
        : undefined;

  return (
    <li className="rounded-lg border border-border p-3">
      <div className="flex items-center justify-between">
        <span className="font-medium">{campaign.cycleYear} Cycle</span>
        <Badge tone={campaign.status === "Closed" ? "positive" : campaign.status === "Open" ? "info" : "warning"}>
          {campaign.status}
        </Badge>
      </div>
      {errorMessage && <p className="mt-1 text-xs text-negative">{errorMessage}</p>}
      <ul className="mt-2 space-y-1 text-xs text-ink-muted">
        {campaign.raters.map((r) => (
          <li key={r.id}>
            {r.raterEmployee.legalName} ({r.category}) — {r.status}
            {r.rating != null && ` — ${r.rating}/5`}
          </li>
        ))}
      </ul>

      {campaign.status === "Draft" && (
        <div className="mt-2 flex flex-wrap items-end gap-2 border-t border-border pt-2">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Nominate Rater</span>
            <select value={raterId} onChange={(e) => setRaterId(e.target.value)} className="input w-48 text-xs">
              <option value="">Select employee…</option>
              {employees.data?.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.legalName}
                </option>
              ))}
            </select>
          </label>
          <select value={category} onChange={(e) => setCategory(e.target.value as typeof category)} className="input text-xs">
            {RATER_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={!raterId || nominate.isPending}
            onClick={() => nominate.mutate()}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-primary disabled:opacity-60"
          >
            Nominate
          </button>
          <button
            type="button"
            disabled={campaign.raters.length === 0 || open.isPending}
            onClick={() => open.mutate()}
            className="ml-auto rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
          >
            Open Campaign
          </button>
        </div>
      )}

      {campaign.status === "Open" && (
        <button
          type="button"
          disabled={close.isPending}
          onClick={() => close.mutate()}
          className="mt-2 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-primary disabled:opacity-60"
        >
          Close Campaign
        </button>
      )}
    </li>
  );
}

/** Manage 360 campaigns for a direct report — the subject's manager or org_admin/hr_ops (enforced server-side). */
export function Feedback360ManagePanel() {
  const queryClient = useQueryClient();
  const employees = useQuery({ queryKey: ["employees"], queryFn: listEmployees });
  const [subjectEmployeeId, setSubjectEmployeeId] = useState("");
  const [cycleYear, setCycleYear] = useState(String(new Date().getUTCFullYear()));

  const campaigns = useQuery({
    queryKey: ["feedback360-campaigns", subjectEmployeeId],
    queryFn: () => listFeedbackCampaignsForSubject(subjectEmployeeId),
    enabled: !!subjectEmployeeId,
  });

  const create = useMutation({
    mutationFn: () => createFeedbackCampaign({ subjectEmployeeId, cycleYear: Number(cycleYear) }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["feedback360-campaigns", subjectEmployeeId] }),
  });
  const errorMessage = create.error instanceof ApiError ? create.error.message : undefined;

  return (
    <Card title="Manage 360 Feedback Campaigns">
      <div className="flex flex-wrap items-end gap-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Employee</span>
          <select
            value={subjectEmployeeId}
            onChange={(e) => setSubjectEmployeeId(e.target.value)}
            className="input w-64"
          >
            <option value="">Select employee…</option>
            {employees.data?.map((e) => (
              <option key={e.id} value={e.id}>
                {e.legalName} ({e.employeeCode})
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Cycle Year</span>
          <input
            type="number"
            value={cycleYear}
            onChange={(e) => setCycleYear(e.target.value)}
            className="input w-24"
          />
        </label>
        <button
          type="button"
          disabled={!subjectEmployeeId || create.isPending}
          onClick={() => create.mutate()}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          {create.isPending ? "Creating…" : "New Campaign"}
        </button>
      </div>
      {errorMessage && <p className="mt-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}

      {subjectEmployeeId && (
        <ul className="mt-4 space-y-3">
          {campaigns.data?.map((c) => (
            <CampaignRow key={c.id} campaign={c} subjectEmployeeId={subjectEmployeeId} />
          ))}
          {campaigns.data?.length === 0 && (
            <p className="text-ink-muted">No 360 campaigns yet for this employee.</p>
          )}
        </ul>
      )}
    </Card>
  );
}
