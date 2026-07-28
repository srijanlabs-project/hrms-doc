import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { ApiError } from "../../lib/api/http";
import { enrollInLearningPath, listLearningPathCatalog, listMyLearningPaths } from "../../lib/api/learning";
import { useAuth } from "../auth/AuthProvider";
import { CreateLearningPathForm } from "./CreateLearningPathForm";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/** W3·E12 gap closure ("learning paths") — an ordered course sequence, progress computed live from course-level enrollments. */
export function LearningPathsPanel() {
  const { user } = useAuth();
  const isAdmin = ADMIN_ROLES.some((role) => user?.roles.includes(role));
  const queryClient = useQueryClient();

  const catalog = useQuery({ queryKey: ["learning-paths-catalog"], queryFn: listLearningPathCatalog });
  const mine = useQuery({ queryKey: ["learning-paths-mine"], queryFn: listMyLearningPaths });

  const enrollMutation = useMutation({
    mutationFn: (id: string) => enrollInLearningPath(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["learning-paths-catalog"] });
      void queryClient.invalidateQueries({ queryKey: ["learning-paths-mine"] });
    },
  });

  const enrolledPathIds = new Set(mine.data?.map((p) => p.path.id));
  const errorMessage = enrollMutation.error instanceof ApiError ? enrollMutation.error.message : undefined;

  return (
    <Card title="Learning Paths">
      <div className="space-y-4">
        {errorMessage && <p className="rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}

        {isAdmin && <CreateLearningPathForm />}

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">Available Paths</p>
          <ul className="space-y-2">
            {catalog.data?.map((path) => (
              <li key={path.id} className="rounded-lg border border-border p-3 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="font-medium">{path.title}</span>{" "}
                    <span className="text-xs text-ink-faint">({path.courses.length} courses)</span>
                    {path.description && <p className="mt-1 text-xs text-ink-faint">{path.description}</p>}
                  </div>
                  {!enrolledPathIds.has(path.id) && (
                    <button
                      type="button"
                      onClick={() => enrollMutation.mutate(path.id)}
                      className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
                    >
                      Enroll
                    </button>
                  )}
                  {enrolledPathIds.has(path.id) && <Badge tone="info">Enrolled</Badge>}
                </div>
              </li>
            ))}
            {catalog.data?.length === 0 && <p className="text-sm text-ink-faint">No learning paths published yet.</p>}
          </ul>
        </div>

        {mine.data && mine.data.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">My Progress</p>
            <ul className="space-y-2">
              {mine.data.map((progress) => (
                <li key={progress.path.id} className="rounded-lg border border-border p-3 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{progress.path.title}</span>
                    <span className="text-xs text-ink-faint">
                      {progress.completedCourses}/{progress.totalCourses} courses
                    </span>
                  </div>
                  <div className="mt-2">
                    <ProgressBar value={progress.totalCourses ? (progress.completedCourses / progress.totalCourses) * 100 : 0} />
                  </div>
                  {progress.isComplete && <Badge tone="positive">Path Complete</Badge>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}
