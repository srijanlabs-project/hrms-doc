import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { listEmployees } from "../../lib/api/employees";
import { ApiError } from "../../lib/api/http";
import { cancelInterview, listInterviewRounds, scheduleInterview, submitInterviewFeedback } from "../../lib/api/recruitment";
import type { Application, InterviewRound } from "../../lib/api/types";

const RECOMMENDATIONS = ["StrongHire", "Hire", "NoHire", "StrongNoHire"] as const;
const roundTone: Record<string, "positive" | "negative" | "neutral"> = {
  Scheduled: "neutral",
  Completed: "positive",
  Cancelled: "negative",
};

function FeedbackForm({ round }: { round: InterviewRound }) {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState("5");
  const [recommendation, setRecommendation] = useState<(typeof RECOMMENDATIONS)[number]>("Hire");
  const [comments, setComments] = useState("");

  const submit = useMutation({
    mutationFn: () =>
      submitInterviewFeedback(round.id, { rating: Number(rating), recommendation, comments: comments || undefined }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["interview-rounds", round.applicationId] }),
  });

  return (
    <form
      className="mt-1 flex flex-wrap items-end gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        submit.mutate();
      }}
    >
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-ink-muted">Rating (1-5)</span>
        <input
          required
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="input w-16 text-xs"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-ink-muted">Recommendation</span>
        <select
          value={recommendation}
          onChange={(e) => setRecommendation(e.target.value as typeof recommendation)}
          className="input text-xs"
        >
          {RECOMMENDATIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-ink-muted">Comments</span>
        <input value={comments} onChange={(e) => setComments(e.target.value)} className="input w-48 text-xs" />
      </label>
      <button
        type="submit"
        disabled={submit.isPending}
        className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-primary disabled:opacity-60"
      >
        {submit.isPending ? "Saving…" : "Submit Feedback"}
      </button>
    </form>
  );
}

function RoundRow({ round }: { round: InterviewRound }) {
  const queryClient = useQueryClient();
  const cancel = useMutation({
    mutationFn: () => cancelInterview(round.id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["interview-rounds", round.applicationId] }),
  });

  return (
    <li className="rounded-lg border border-border p-2 text-sm">
      <div className="flex items-center gap-2">
        <span className="font-medium">Round {round.roundNumber}</span>
        <span className="text-ink-faint">
          {round.interviewer.legalName} · {new Date(round.scheduledAt).toLocaleString()} · {round.mode}
        </span>
        <Badge tone={roundTone[round.status]}>{round.status}</Badge>
        {round.status === "Scheduled" && (
          <button
            type="button"
            disabled={cancel.isPending}
            onClick={() => cancel.mutate()}
            className="ml-auto rounded-lg border border-border px-3 py-1 text-xs font-medium hover:border-negative hover:text-negative disabled:opacity-60"
          >
            Cancel
          </button>
        )}
      </div>
      {round.status === "Scheduled" && !round.feedback && <FeedbackForm round={round} />}
      {round.feedback && (
        <div className="mt-1 text-xs text-ink-muted">
          Feedback: {round.feedback.rating}/5 · {round.feedback.recommendation}
          {round.feedback.comments && ` — "${round.feedback.comments}"`}
        </div>
      )}
    </li>
  );
}

/** v1 slice of 06-interview-scheduling.md + 07-interview-feedback.md — single interviewer per round, no panel or calendar sync. */
export function InterviewSection({ application }: { application: Application }) {
  const queryClient = useQueryClient();
  const rounds = useQuery({
    queryKey: ["interview-rounds", application.id],
    queryFn: () => listInterviewRounds(application.id),
  });
  const employees = useQuery({ queryKey: ["employees"], queryFn: listEmployees });

  const [interviewerId, setInterviewerId] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");

  const schedule = useMutation({
    mutationFn: () => scheduleInterview({ applicationId: application.id, interviewerId, scheduledAt }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["interview-rounds", application.id] });
      setInterviewerId("");
      setScheduledAt("");
    },
  });
  const scheduleError = schedule.error instanceof ApiError ? schedule.error.message : undefined;

  return (
    <div className="mt-2 border-t border-border pt-2">
      <ul className="space-y-2">
        {rounds.data?.map((round) => (
          <RoundRow key={round.id} round={round} />
        ))}
      </ul>
      {scheduleError && <p className="mt-1 text-xs text-negative">{scheduleError}</p>}
      <form
        className="mt-2 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          schedule.mutate();
        }}
      >
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Interviewer</span>
          <select
            required
            value={interviewerId}
            onChange={(e) => setInterviewerId(e.target.value)}
            className="input w-40 text-xs"
          >
            <option value="">Select…</option>
            {employees.data?.map((e) => (
              <option key={e.id} value={e.id}>
                {e.legalName}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Scheduled At</span>
          <input
            required
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="input text-xs"
          />
        </label>
        <button
          type="submit"
          disabled={schedule.isPending}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-primary disabled:opacity-60"
        >
          {schedule.isPending ? "Scheduling…" : "Schedule Round"}
        </button>
      </form>
    </div>
  );
}
