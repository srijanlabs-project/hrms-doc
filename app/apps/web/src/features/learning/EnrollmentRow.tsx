import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { ApiError } from "../../lib/api/http";
import { completeEnrollment, submitAssessment, withdrawEnrollment } from "../../lib/api/learning";
import type { LearningEnrollment } from "../../lib/api/types";
import { enrollmentStatusTone } from "./status-tone";

/** W3·E12 gap closure ("assessments") — a course with a passingScore requires submitting a score instead of a plain Mark Complete. */
export function EnrollmentRow({ enrollment }: { enrollment: LearningEnrollment }) {
  const queryClient = useQueryClient();
  const invalidate = () => void queryClient.invalidateQueries({ queryKey: ["learning-enrollments-my"] });

  const [score, setScore] = useState("");
  const [maxScore, setMaxScore] = useState("100");

  const completeMutation = useMutation({ mutationFn: () => completeEnrollment(enrollment.id), onSuccess: invalidate });
  const withdrawMutation = useMutation({ mutationFn: () => withdrawEnrollment(enrollment.id), onSuccess: invalidate });
  const assessmentMutation = useMutation({
    mutationFn: () => submitAssessment(enrollment.id, Number(score), Number(maxScore)),
    onSuccess: () => {
      invalidate();
      setScore("");
    },
  });

  const isActive = enrollment.status === "Enrolled" || enrollment.status === "Overdue";
  const requiresAssessment = enrollment.course.passingScore !== null;
  const errorMessage = assessmentMutation.error instanceof ApiError ? assessmentMutation.error.message : undefined;

  return (
    <li className="rounded-lg border border-border p-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-medium">{enrollment.course.title}</span>{" "}
          <Badge tone={enrollmentStatusTone(enrollment.status)}>{enrollment.status}</Badge>
          <p className="mt-1 text-xs text-ink-faint">
            {enrollment.course.durationHours}h {enrollment.course.isMandatory && "· Mandatory"}
            {enrollment.dueDate && ` · Due ${new Date(enrollment.dueDate).toLocaleDateString("en-IN")}`}
            {requiresAssessment && ` · Requires ${enrollment.course.passingScore}% to pass`}
          </p>
          {enrollment.assessmentScore !== null && (
            <p className="mt-1 text-xs text-ink-faint">
              Last attempt: {enrollment.assessmentScore}/{enrollment.assessmentMaxScore} —{" "}
              <Badge tone={enrollment.assessmentPassed ? "positive" : "negative"}>
                {enrollment.assessmentPassed ? "Passed" : "Not passed"}
              </Badge>
            </p>
          )}
        </div>
        {isActive && !requiresAssessment && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => completeMutation.mutate()}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
            >
              Mark Complete
            </button>
            <button
              type="button"
              onClick={() => withdrawMutation.mutate()}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover"
            >
              Withdraw
            </button>
          </div>
        )}
      </div>
      {isActive && requiresAssessment && (
        <form
          className="mt-2 flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            assessmentMutation.mutate();
          }}
        >
          {errorMessage && <p className="w-full text-xs text-negative">{errorMessage}</p>}
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Score</span>
            <input required type="number" min="0" value={score} onChange={(e) => setScore(e.target.value)} className="input w-20 text-xs" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Max Score</span>
            <input required type="number" min="1" value={maxScore} onChange={(e) => setMaxScore(e.target.value)} className="input w-20 text-xs" />
          </label>
          <button
            type="submit"
            disabled={assessmentMutation.isPending}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
          >
            {assessmentMutation.isPending ? "Submitting…" : "Submit Assessment"}
          </button>
          <button
            type="button"
            onClick={() => withdrawMutation.mutate()}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover"
          >
            Withdraw
          </button>
        </form>
      )}
    </li>
  );
}
