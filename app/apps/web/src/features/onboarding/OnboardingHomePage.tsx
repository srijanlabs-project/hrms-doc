import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { completeMyTask, getMyOnboardingCase } from "../../lib/api/onboarding";
import { onboardingCaseStatusTone, onboardingTaskStatusTone } from "./status-tone";

/**
 * Joiner-facing onboarding home — docs/08-submodule-specifications/02-people-management/09-onboarding.md.
 * Only new hires converted from an accepted offer have a case (see
 * OfferService.convert). Anyone else sees a friendly empty state, not an error.
 */
export function OnboardingHomePage() {
  const queryClient = useQueryClient();
  const onboardingCase = useQuery({
    queryKey: ["onboarding-my"],
    queryFn: getMyOnboardingCase,
    retry: false,
  });

  const completeMutation = useMutation({
    mutationFn: (taskId: string) => completeMyTask(taskId),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["onboarding-my"] }),
  });

  if (onboardingCase.isLoading) {
    return <p className="text-ink-muted">Loading your onboarding checklist…</p>;
  }

  if (onboardingCase.error instanceof ApiError) {
    return (
      <div className="rounded-(--radius-card) border border-border bg-surface p-8 text-center text-ink-muted">
        No onboarding checklist found for your account.
      </div>
    );
  }

  const data = onboardingCase.data;
  if (!data) return null;

  const remainingBlocking = data.tasks.filter((t) => t.isBlocking && t.status === "NotStarted").length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Welcome to Staffsy</h1>
        <p className="text-ink-muted">Complete your onboarding checklist before your join date.</p>
      </header>

      <Card
        title="Onboarding Status"
        action={<Badge tone={onboardingCaseStatusTone(data.status)}>{data.status}</Badge>}
      >
        <p className="text-ink-muted">
          {data.status === "Activated"
            ? "Your onboarding is complete — welcome aboard!"
            : remainingBlocking > 0
              ? `${remainingBlocking} required task(s) remaining.`
              : "All required tasks are done — HR will activate your account shortly."}
        </p>
      </Card>

      <Card title="Checklist">
        <ul className="space-y-2">
          {data.tasks.map((task) => (
            <li key={task.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
              <div>
                <div className="font-medium">{task.title}</div>
                {task.isBlocking && <div className="text-xs text-ink-faint">Required before activation</div>}
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={onboardingTaskStatusTone(task.status)}>{task.status}</Badge>
                {task.status === "NotStarted" && (
                  <button
                    type="button"
                    disabled={completeMutation.isPending}
                    onClick={() => completeMutation.mutate(task.id)}
                    className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
                  >
                    Mark Complete
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
