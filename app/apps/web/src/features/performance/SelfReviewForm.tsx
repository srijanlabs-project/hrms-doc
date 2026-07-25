import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { submitSelfReview } from "../../lib/api/performance";

export function SelfReviewForm({ appraisalId }: { appraisalId: string }) {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState("3");
  const [comments, setComments] = useState("");

  const mutation = useMutation({
    mutationFn: () => submitSelfReview(appraisalId, Number(rating), comments || undefined),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["appraisals-my"] }),
  });

  return (
    <form
      className="mt-2 space-y-2 border-t border-border pt-2"
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
    >
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-ink-muted">Self Rating (1-5)</span>
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
        disabled={mutation.isPending}
        className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
      >
        {mutation.isPending ? "Submitting…" : "Submit Self-Review"}
      </button>
    </form>
  );
}
