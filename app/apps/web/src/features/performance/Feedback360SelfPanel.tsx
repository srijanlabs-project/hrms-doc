import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { myFeedbackRequests, myFeedbackSummary, submitFeedback360Response } from "../../lib/api/performance";
import type { FeedbackPendingRequest } from "../../lib/api/types";

function RespondForm({ request }: { request: FeedbackPendingRequest }) {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState("3");
  const [strengths, setStrengths] = useState("");
  const [developmentAreas, setDevelopmentAreas] = useState("");

  const submit = useMutation({
    mutationFn: () =>
      submitFeedback360Response(request.id, {
        rating: Number(rating),
        strengths: strengths || undefined,
        developmentAreas: developmentAreas || undefined,
      }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["feedback360-my-requests"] }),
  });
  const errorMessage = submit.error instanceof ApiError ? submit.error.message : undefined;

  return (
    <li className="rounded-lg border border-border p-3">
      <div className="mb-2 font-medium">
        {request.campaign.subjectEmployee.legalName} — {request.campaign.cycleYear} ({request.category})
      </div>
      {errorMessage && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      <form
        className="space-y-2"
        onSubmit={(e) => {
          e.preventDefault();
          submit.mutate();
        }}
      >
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Rating (1-5)</span>
          <select value={rating} onChange={(e) => setRating(e.target.value)} className="input w-24">
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Strengths</span>
          <textarea
            value={strengths}
            onChange={(e) => setStrengths(e.target.value)}
            rows={2}
            className="input w-full resize-none"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Development Areas</span>
          <textarea
            value={developmentAreas}
            onChange={(e) => setDevelopmentAreas(e.target.value)}
            rows={2}
            className="input w-full resize-none"
          />
        </label>
        <button
          type="submit"
          disabled={submit.isPending}
          className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          {submit.isPending ? "Submitting…" : "Submit Feedback"}
        </button>
      </form>
    </li>
  );
}

/** Self-service: any employee's own pending rater invites and their own released (aggregated, unattributed) 360 results. */
export function Feedback360SelfPanel() {
  const requests = useQuery({ queryKey: ["feedback360-my-requests"], queryFn: myFeedbackRequests });
  const summary = useQuery({ queryKey: ["feedback360-my-summary"], queryFn: myFeedbackSummary });

  return (
    <>
      <Card title="My Pending Feedback Requests">
        {requests.data?.length === 0 && <p className="text-ink-muted">No feedback requests pending your response.</p>}
        <ul className="space-y-3">
          {requests.data?.map((request) => (
            <RespondForm key={request.id} request={request} />
          ))}
        </ul>
      </Card>

      <Card title="My 360 Feedback">
        {summary.data?.length === 0 && <p className="text-ink-muted">No 360 feedback has been released to you yet.</p>}
        <ul className="space-y-3">
          {summary.data?.map((s) => (
            <li key={s.id} className="rounded-lg border border-border p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">{s.cycleYear} Cycle</span>
                <span className="text-sm text-ink-muted">
                  {s.averageRating ?? "—"}/5 avg · {s.responseCount} response(s)
                </span>
              </div>
              {s.strengths.length > 0 && (
                <div className="mt-2 text-xs">
                  <span className="font-medium text-ink-muted">Strengths:</span>
                  <ul className="ml-4 list-disc text-ink-faint">
                    {s.strengths.map((text, i) => (
                      <li key={i}>{text}</li>
                    ))}
                  </ul>
                </div>
              )}
              {s.developmentAreas.length > 0 && (
                <div className="mt-2 text-xs">
                  <span className="font-medium text-ink-muted">Development Areas:</span>
                  <ul className="ml-4 list-disc text-ink-faint">
                    {s.developmentAreas.map((text, i) => (
                      <li key={i}>{text}</li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
