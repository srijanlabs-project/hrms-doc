import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { finalizeAppraisal, submitManagerReview } from "../../lib/api/performance";
import type { Appraisal } from "../../lib/api/types";

export function ManagerReviewForm({ appraisal }: { appraisal: Appraisal }) {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState("3");
  const [comments, setComments] = useState("");
  const invalidate = () => void queryClient.invalidateQueries({ queryKey: ["appraisals-team"] });

  const reviewMutation = useMutation({
    mutationFn: () => submitManagerReview(appraisal.id, Number(rating), comments || undefined),
    onSuccess: invalidate,
  });
  const finalizeMutation = useMutation({
    mutationFn: () => finalizeAppraisal(appraisal.id),
    onSuccess: invalidate,
  });

  if (appraisal.status === "ManagerReviewed") {
    return (
      <button
        type="button"
        disabled={finalizeMutation.isPending}
        onClick={() => finalizeMutation.mutate()}
        className="mt-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
      >
        {finalizeMutation.isPending ? "Finalizing…" : "Finalize"}
      </button>
    );
  }

  if (appraisal.status !== "SelfSubmitted") return null;

  return (
    <form
      className="mt-2 space-y-2 border-t border-border pt-2"
      onSubmit={(e) => {
        e.preventDefault();
        reviewMutation.mutate();
      }}
    >
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-ink-muted">Manager Rating (1-5)</span>
        <select value={rating} onChange={(e) => setRating(e.target.value)} className="input w-24">
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-ink-muted">Comments</span>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows={3}
          className="input w-full resize-none"
        />
      </label>
      <button
        type="submit"
        disabled={reviewMutation.isPending}
        className="rounded-lg border border-border px-4 py-2 text-xs font-medium hover:border-primary disabled:opacity-60"
      >
        {reviewMutation.isPending ? "Submitting…" : "Submit Manager Review"}
      </button>
    </form>
  );
}
