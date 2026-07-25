import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { listMySurveys, respondToSurvey } from "../../lib/api/experience";
import { ApiError } from "../../lib/api/http";
import type { SurveyWithResponseFlag } from "../../lib/api/types";

function SurveyResponseForm({ survey }: { survey: SurveyWithResponseFlag }) {
  const queryClient = useQueryClient();
  const [answers, setAnswers] = useState<Record<string, { ratingValue?: number; textValue?: string }>>({});

  const submit = useMutation({
    mutationFn: () =>
      respondToSurvey(survey.id, {
        answers: survey.questions.map((q) => ({ questionId: q.id, ...answers[q.id] })),
      }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["surveys-my"] }),
  });
  const errorMessage = submit.error instanceof ApiError ? submit.error.message : undefined;
  const allAnswered = survey.questions.every((q) => {
    const a = answers[q.id];
    return q.type === "Rating" ? a?.ratingValue != null : !!a?.textValue?.trim();
  });

  return (
    <form
      className="mt-3 space-y-3 border-t border-border pt-3"
      onSubmit={(e) => {
        e.preventDefault();
        submit.mutate();
      }}
    >
      {errorMessage && <p className="rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      {survey.questions.map((q) => (
        <div key={q.id}>
          <p className="mb-1 text-sm font-medium">{q.text}</p>
          {q.type === "Rating" ? (
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: { ratingValue: n } }))}
                  className={`h-8 w-8 rounded-lg border text-sm font-semibold ${
                    answers[q.id]?.ratingValue === n
                      ? "border-primary bg-primary text-white"
                      : "border-border text-ink-muted hover:border-primary"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          ) : (
            <textarea
              value={answers[q.id]?.textValue ?? ""}
              onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: { textValue: e.target.value } }))}
              className="input w-full"
              rows={2}
            />
          )}
        </div>
      ))}
      <button
        type="submit"
        disabled={submit.isPending || !allAnswered}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
      >
        {submit.isPending ? "Submitting…" : "Submit Response"}
      </button>
    </form>
  );
}

/** Self-service: respond to Published/Closed surveys once each. Pulse surveys render identically — same entity, just `type: "Pulse"`. */
export function MySurveysPanel() {
  const surveys = useQuery({ queryKey: ["surveys-my"], queryFn: listMySurveys });

  return (
    <Card title="Surveys">
      <ul className="space-y-3">
        {surveys.data?.map((survey) => (
          <li key={survey.id} className="rounded-lg border border-border p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">{survey.title}</span>
              <div className="flex items-center gap-2">
                {survey.type === "Pulse" && <Badge tone="neutral">Pulse</Badge>}
                <Badge tone={survey.hasResponded ? "positive" : survey.status === "Closed" ? "neutral" : "warning"}>
                  {survey.hasResponded ? "Responded" : survey.status === "Closed" ? "Closed" : "Open"}
                </Badge>
              </div>
            </div>
            {survey.description && <p className="mt-1 text-sm text-ink-muted">{survey.description}</p>}
            {!survey.hasResponded && survey.status === "Published" && <SurveyResponseForm survey={survey} />}
          </li>
        ))}
        {surveys.data?.length === 0 && <p className="text-ink-muted">No surveys published yet.</p>}
      </ul>
    </Card>
  );
}
