import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "../../components/ui/Badge";
import { advanceApplication, rejectApplication } from "../../lib/api/recruitment";
import type { Application } from "../../lib/api/types";
import { InterviewSection } from "./InterviewSection";
import { OfferSection } from "./OfferSection";
import { applicationStageTone } from "./status-tone";

const STAGES = ["Applied", "Screening", "Interview", "Offer", "Hired"] as const;
const TERMINAL_STAGES = ["Hired", "Rejected"];

export function ApplicationRow({ application }: { application: Application }) {
  const queryClient = useQueryClient();
  const invalidate = () => void queryClient.invalidateQueries({ queryKey: ["applications", application.requisitionId] });

  const advanceMutation = useMutation({
    mutationFn: (stage: string) => advanceApplication(application.id, stage),
    onSuccess: invalidate,
  });
  const rejectMutation = useMutation({
    mutationFn: () => rejectApplication(application.id),
    onSuccess: invalidate,
  });

  const isTerminal = TERMINAL_STAGES.includes(application.stage);
  const currentIndex = STAGES.indexOf(application.stage as (typeof STAGES)[number]);
  const nextStage = !isTerminal && currentIndex >= 0 && currentIndex < STAGES.length - 1 ? STAGES[currentIndex + 1] : null;

  return (
    <li className="rounded-lg border border-border p-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="font-medium">{application.candidate.fullName}</div>
          <div className="text-xs text-ink-faint">
            {application.candidate.email} · {application.candidate.source}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone={applicationStageTone(application.stage)}>{application.stage}</Badge>
          {!isTerminal && nextStage && (
            <button
              type="button"
              disabled={advanceMutation.isPending}
              onClick={() => advanceMutation.mutate(nextStage)}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-primary disabled:opacity-60"
            >
              Advance to {nextStage}
            </button>
          )}
          {!isTerminal && (
            <button
              type="button"
              disabled={rejectMutation.isPending}
              onClick={() => rejectMutation.mutate()}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-negative hover:text-negative disabled:opacity-60"
            >
              Reject
            </button>
          )}
        </div>
      </div>

      {(application.stage === "Interview" || application.stage === "Offer" || application.stage === "Hired") && (
        <InterviewSection application={application} />
      )}
      {(application.stage === "Offer" || application.stage === "Hired") && <OfferSection application={application} />}
    </li>
  );
}
