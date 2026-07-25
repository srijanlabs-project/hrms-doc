import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { ApiError } from "../../lib/api/http";
import {
  approveOffer,
  completeBackgroundCheck,
  convertOffer,
  createOffer,
  initiateBackgroundCheck,
  issueOffer,
  respondToOffer,
} from "../../lib/api/recruitment";
import type { Application } from "../../lib/api/types";
import { offerStatusTone } from "./status-tone";

const CHECK_TYPES = ["Comprehensive", "Identity", "Employment", "Education", "Criminal"] as const;

/** Background verification — an L2 dependency named inside 08-offer-management.md, not its own deep-spec. A Flagged result blocks OfferService.convert() server-side. */
function BackgroundCheckSection({ application }: { application: Application }) {
  const queryClient = useQueryClient();
  const [checkType, setCheckType] = useState<(typeof CHECK_TYPES)[number]>("Comprehensive");
  const [remarks, setRemarks] = useState("");
  const invalidate = () => void queryClient.invalidateQueries({ queryKey: ["applications", application.requisitionId] });

  const initiate = useMutation({
    mutationFn: () => initiateBackgroundCheck(application.offer!.id, checkType),
    onSuccess: invalidate,
  });
  const complete = useMutation({
    mutationFn: (status: "Cleared" | "Flagged") => completeBackgroundCheck(application.offer!.id, status, remarks || undefined),
    onSuccess: invalidate,
  });

  const check = application.offer?.backgroundCheck;
  if (!check) {
    return (
      <div className="mt-2 flex items-center gap-2 border-t border-border pt-2 text-sm">
        <span className="text-ink-muted">Background check:</span>
        <select value={checkType} onChange={(e) => setCheckType(e.target.value as typeof checkType)} className="input w-40 text-xs">
          {CHECK_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={initiate.isPending}
          onClick={() => initiate.mutate()}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-primary disabled:opacity-60"
        >
          {initiate.isPending ? "Starting…" : "Initiate Check"}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-border pt-2 text-sm">
      <span className="text-ink-muted">Background check ({check.checkType}):</span>
      <Badge tone={check.status === "Flagged" ? "negative" : check.status === "Cleared" ? "positive" : "neutral"}>
        {check.status}
      </Badge>
      {check.status === "Pending" && (
        <>
          <input
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Remarks (optional)"
            className="input w-48 text-xs"
          />
          <button
            type="button"
            disabled={complete.isPending}
            onClick={() => complete.mutate("Cleared")}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-positive hover:text-positive disabled:opacity-60"
          >
            Mark Cleared
          </button>
          <button
            type="button"
            disabled={complete.isPending}
            onClick={() => complete.mutate("Flagged")}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-negative hover:text-negative disabled:opacity-60"
          >
            Flag
          </button>
        </>
      )}
      {check.remarks && <span className="text-xs text-ink-faint">"{check.remarks}"</span>}
    </div>
  );
}

export function OfferSection({ application }: { application: Application }) {
  const queryClient = useQueryClient();
  const [monthlyBasic, setMonthlyBasic] = useState("");
  const [joiningDate, setJoiningDate] = useState("");

  const invalidate = () => void queryClient.invalidateQueries({ queryKey: ["applications", application.requisitionId] });

  const createMutation = useMutation({
    mutationFn: () => createOffer(application.id, Number(monthlyBasic), joiningDate),
    onSuccess: invalidate,
  });

  const offerAction = useMutation({
    mutationFn: (action: "approve" | "issue" | "accept" | "decline" | "convert") => {
      if (!application.offer) throw new Error("no offer");
      if (action === "approve") return approveOffer(application.offer.id);
      if (action === "issue") return issueOffer(application.offer.id);
      if (action === "accept") return respondToOffer(application.offer.id, true);
      if (action === "decline") return respondToOffer(application.offer.id, false);
      return convertOffer(application.offer.id);
    },
    onSuccess: invalidate,
  });

  const actionError = offerAction.error instanceof ApiError ? offerAction.error.message : undefined;

  if (!application.offer) {
    return (
      <form
        className="mt-2 flex flex-wrap items-end gap-2 border-t border-border pt-2"
        onSubmit={(e) => {
          e.preventDefault();
          createMutation.mutate();
        }}
      >
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Monthly Basic (₹)</span>
          <input
            required
            type="number"
            min="1"
            value={monthlyBasic}
            onChange={(e) => setMonthlyBasic(e.target.value)}
            className="input w-32"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Joining Date</span>
          <input
            required
            type="date"
            value={joiningDate}
            onChange={(e) => setJoiningDate(e.target.value)}
            className="input"
          />
        </label>
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-primary disabled:opacity-60"
        >
          {createMutation.isPending ? "Creating…" : "Create Offer"}
        </button>
      </form>
    );
  }

  const nextAction: Record<string, { action: "approve" | "issue" | "accept" | "convert"; label: string } | undefined> = {
    Draft: { action: "approve", label: "Approve Offer" },
    Approved: { action: "issue", label: "Issue Offer" },
    Issued: { action: "accept", label: "Record Acceptance" },
    Accepted: { action: "convert", label: "Convert to Employee" },
  };
  const next = nextAction[application.offer.status];

  return (
    <div>
      <div className="mt-2 flex items-center gap-2 border-t border-border pt-2 text-sm">
        <span className="text-ink-muted">Offer:</span>
        <Badge tone={offerStatusTone(application.offer.status)}>{application.offer.status}</Badge>
        <span className="text-ink-faint">₹{application.offer.monthlyBasic.toLocaleString("en-IN")}/mo</span>
        {next && (
          <button
            type="button"
            disabled={offerAction.isPending}
            onClick={() => offerAction.mutate(next.action)}
            className="ml-auto rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-primary disabled:opacity-60"
          >
            {next.label}
          </button>
        )}
        {application.offer.status === "Issued" && (
          <button
            type="button"
            disabled={offerAction.isPending}
            onClick={() => offerAction.mutate("decline")}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-negative hover:text-negative disabled:opacity-60"
          >
            Record Decline
          </button>
        )}
        {application.offer.status === "Converted" && (
          <span className="ml-auto text-xs text-positive">Employee created</span>
        )}
      </div>
      {actionError && <p className="mt-1 text-xs text-negative">{actionError}</p>}
      {(application.offer.status === "Accepted" || application.offer.status === "Converted") && (
        <BackgroundCheckSection application={application} />
      )}
    </div>
  );
}
