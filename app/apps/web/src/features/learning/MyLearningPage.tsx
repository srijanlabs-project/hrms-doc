import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { completeEnrollment, listMyEnrollments, withdrawEnrollment } from "../../lib/api/learning";
import { enrollmentStatusTone } from "./status-tone";
import { TeamMandatoryTrainingPanel } from "./TeamMandatoryTrainingPanel";

/** My Learning dashboard — self-service completion/withdrawal only, no session attendance or scoring. */
export function MyLearningPage() {
  const queryClient = useQueryClient();
  const enrollments = useQuery({ queryKey: ["learning-enrollments-my"], queryFn: listMyEnrollments });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["learning-enrollments-my"] });
  const completeMutation = useMutation({ mutationFn: (id: string) => completeEnrollment(id), onSuccess: invalidate });
  const withdrawMutation = useMutation({ mutationFn: (id: string) => withdrawEnrollment(id), onSuccess: invalidate });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">My Learning</h1>
        <p className="text-ink-muted">Track your enrolled courses and mark completion.</p>
      </header>

      <Card title="My Enrollments">
        {enrollments.isLoading && <p className="text-ink-muted">Loading enrollments…</p>}
        {enrollments.data?.length === 0 && (
          <p className="text-ink-muted">
            No enrollments yet — browse the <Link to="/learning" className="text-primary underline">Learning Catalog</Link>.
          </p>
        )}
        <ul className="space-y-2">
          {enrollments.data?.map((enrollment) => (
            <li key={enrollment.id} className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <span className="font-medium">{enrollment.course.title}</span>{" "}
                <Badge tone={enrollmentStatusTone(enrollment.status)}>{enrollment.status}</Badge>
                <p className="mt-1 text-xs text-ink-faint">
                  {enrollment.course.durationHours}h {enrollment.course.isMandatory && "· Mandatory"}
                  {enrollment.dueDate && ` · Due ${new Date(enrollment.dueDate).toLocaleDateString("en-IN")}`}
                </p>
              </div>
              {(enrollment.status === "Enrolled" || enrollment.status === "Overdue") && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => completeMutation.mutate(enrollment.id)}
                    className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
                  >
                    Mark Complete
                  </button>
                  <button
                    type="button"
                    onClick={() => withdrawMutation.mutate(enrollment.id)}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover"
                  >
                    Withdraw
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </Card>

      <TeamMandatoryTrainingPanel />
    </div>
  );
}
