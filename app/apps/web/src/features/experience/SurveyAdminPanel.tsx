import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { closeSurvey, createSurvey, getSurveyResults, listAllSurveysAdmin, publishSurvey } from "../../lib/api/experience";
import { ApiError } from "../../lib/api/http";
import type { Survey } from "../../lib/api/types";

const SURVEY_TYPES = ["Standard", "Pulse"] as const;

function CreateSurveyForm() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<(typeof SURVEY_TYPES)[number]>("Standard");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [questions, setQuestions] = useState([{ text: "", type: "Rating" as "Rating" | "Text" }]);

  const create = useMutation({
    mutationFn: () => createSurvey({ title, description: description || undefined, type, isAnonymous, questions }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["surveys-admin"] });
      setTitle("");
      setDescription("");
      setQuestions([{ text: "", type: "Rating" }]);
    },
  });
  const errorMessage = create.error instanceof ApiError ? create.error.message : undefined;

  return (
    <form
      className="mb-4 space-y-3 border-b border-border pb-4"
      onSubmit={(e) => {
        e.preventDefault();
        create.mutate();
      }}
    >
      {errorMessage && <p className="rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      <div className="flex flex-wrap items-end gap-2">
        <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Survey title" className="input w-64" />
        <select value={type} onChange={(e) => setType(e.target.value as typeof type)} className="input">
          {SURVEY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-1.5 text-sm text-ink-muted">
          <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} />
          Anonymous
        </label>
      </div>
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        className="input w-full"
      />

      <div className="space-y-2">
        {questions.map((q, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              required
              value={q.text}
              onChange={(e) =>
                setQuestions((prev) => prev.map((p, i) => (i === index ? { ...p, text: e.target.value } : p)))
              }
              placeholder={`Question ${index + 1}`}
              className="input flex-1"
            />
            <select
              value={q.type}
              onChange={(e) =>
                setQuestions((prev) =>
                  prev.map((p, i) => (i === index ? { ...p, type: e.target.value as "Rating" | "Text" } : p)),
                )
              }
              className="input w-28"
            >
              <option value="Rating">Rating</option>
              <option value="Text">Text</option>
            </select>
            {questions.length > 1 && (
              <button
                type="button"
                onClick={() => setQuestions((prev) => prev.filter((_, i) => i !== index))}
                className="text-xs text-negative"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => setQuestions((prev) => [...prev, { text: "", type: "Rating" }])}
          className="text-xs font-medium text-primary"
        >
          + Add question
        </button>
      </div>

      <button
        type="submit"
        disabled={create.isPending}
        className="rounded-lg border border-border px-3 py-2 text-xs font-medium hover:border-primary disabled:opacity-60"
      >
        Create Draft
      </button>
    </form>
  );
}

function SurveyResultsView({ surveyId }: { surveyId: string }) {
  const results = useQuery({ queryKey: ["survey-results", surveyId], queryFn: () => getSurveyResults(surveyId) });
  if (!results.data) return null;

  return (
    <div className="mt-2 space-y-2 rounded-lg bg-canvas p-3 text-sm">
      <p className="font-medium">
        {results.data.responseCount} response{results.data.responseCount === 1 ? "" : "s"}
        {results.data.isAnonymous && " (anonymous)"}
      </p>
      {results.data.questionResults.map((qr) => (
        <div key={qr.questionId}>
          <p className="text-ink-muted">{qr.text}</p>
          {qr.type === "Rating" ? (
            <p className="font-semibold">
              {qr.averageRating != null ? qr.averageRating.toFixed(1) : "—"} avg ({qr.responseCount} responses)
            </p>
          ) : (
            <ul className="list-disc pl-4">
              {qr.textAnswers?.map((a, i) => <li key={i}>{a}</li>)}
              {qr.textAnswers?.length === 0 && <li className="list-none text-ink-faint">No responses yet.</li>}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

function SurveyRow({ survey }: { survey: Survey }) {
  const queryClient = useQueryClient();
  const [showResults, setShowResults] = useState(false);
  const invalidate = () => void queryClient.invalidateQueries({ queryKey: ["surveys-admin"] });
  const publish = useMutation({ mutationFn: () => publishSurvey(survey.id), onSuccess: invalidate });
  const close = useMutation({ mutationFn: () => closeSurvey(survey.id), onSuccess: invalidate });
  const errorMessage =
    publish.error instanceof ApiError ? publish.error.message : close.error instanceof ApiError ? close.error.message : undefined;

  return (
    <li className="rounded-lg border border-border p-3">
      <div className="flex items-center justify-between">
        <span className="font-medium">
          {survey.title} <span className="text-xs text-ink-faint">({survey.questions.length} questions)</span>
        </span>
        <Badge tone={survey.status === "Published" ? "positive" : survey.status === "Closed" ? "neutral" : "warning"}>
          {survey.status}
        </Badge>
      </div>
      {errorMessage && <p className="mt-1 text-xs text-negative">{errorMessage}</p>}
      <div className="mt-2 flex gap-2">
        {survey.status === "Draft" && (
          <button
            type="button"
            disabled={publish.isPending}
            onClick={() => publish.mutate()}
            className="rounded-lg border border-border px-3 py-1 text-xs font-medium hover:border-primary disabled:opacity-60"
          >
            Publish
          </button>
        )}
        {survey.status === "Published" && (
          <button
            type="button"
            disabled={close.isPending}
            onClick={() => close.mutate()}
            className="rounded-lg border border-border px-3 py-1 text-xs font-medium hover:border-negative hover:text-negative disabled:opacity-60"
          >
            Close
          </button>
        )}
        {survey.status !== "Draft" && (
          <button
            type="button"
            onClick={() => setShowResults((v) => !v)}
            className="rounded-lg border border-border px-3 py-1 text-xs font-medium hover:border-primary"
          >
            {showResults ? "Hide Results" : "View Results"}
          </button>
        )}
      </div>
      {showResults && <SurveyResultsView surveyId={survey.id} />}
    </li>
  );
}

/** Admin: create/publish/close surveys and view aggregated results — anonymity respected server-side. */
export function SurveyAdminPanel() {
  const surveys = useQuery({ queryKey: ["surveys-admin"], queryFn: listAllSurveysAdmin });

  return (
    <Card title="Manage Surveys">
      <CreateSurveyForm />
      <ul className="space-y-2">
        {surveys.data?.map((survey) => (
          <SurveyRow key={survey.id} survey={survey} />
        ))}
        {surveys.data?.length === 0 && <p className="text-ink-muted">No surveys created yet.</p>}
      </ul>
    </Card>
  );
}
