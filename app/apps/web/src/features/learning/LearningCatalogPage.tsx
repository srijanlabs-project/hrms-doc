import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "../../components/ui/Card";
import { useAuth } from "../auth/AuthProvider";
import { ApiError } from "../../lib/api/http";
import {
  archiveCourse,
  enrollInCourse,
  listAllCourses,
  listCourseCatalog,
  listMyEnrollments,
  publishCourse,
  runComplianceTrainingNow,
} from "../../lib/api/learning";
import { AddCourseForm } from "./AddCourseForm";
import { CourseAdminRow } from "./CourseAdminRow";
import { CourseCatalogRow } from "./CourseCatalogRow";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/** v1 slice -> flat catalog, Draft/Published/Archived only. Spec: docs/08-submodule-specifications/12-learning-and-development/01-learning-management-system.md. */
export function LearningCatalogPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isAdmin = ADMIN_ROLES.some((role) => user?.roles.includes(role));

  const catalog = useQuery({ queryKey: ["learning-catalog"], queryFn: listCourseCatalog });
  const myEnrollments = useQuery({ queryKey: ["learning-enrollments-my"], queryFn: listMyEnrollments });
  const allCourses = useQuery({ queryKey: ["learning-courses-admin"], queryFn: listAllCourses, enabled: isAdmin });

  const invalidateCourses = () => {
    void queryClient.invalidateQueries({ queryKey: ["learning-courses-admin"] });
    void queryClient.invalidateQueries({ queryKey: ["learning-catalog"] });
  };

  const publishMutation = useMutation({ mutationFn: (id: string) => publishCourse(id), onSuccess: invalidateCourses });
  const archiveMutation = useMutation({ mutationFn: (id: string) => archiveCourse(id), onSuccess: invalidateCourses });
  const runNowMutation = useMutation({ mutationFn: runComplianceTrainingNow });
  const enrollMutation = useMutation({
    mutationFn: (courseId: string) => enrollInCourse(courseId),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["learning-enrollments-my"] }),
  });

  const enrollError = enrollMutation.error instanceof ApiError ? enrollMutation.error.message : undefined;
  const enrollmentByCourseId = new Map(myEnrollments.data?.map((e) => [e.courseId, e]));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Learning Catalog</h1>
        <p className="text-ink-muted">Browse published courses and self-enroll.</p>
      </header>

      {isAdmin && <AddCourseForm />}

      {isAdmin && (
        <Card
          title="All Courses"
          action={
            <button
              type="button"
              disabled={runNowMutation.isPending}
              onClick={() => runNowMutation.mutate()}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-primary disabled:opacity-60"
            >
              {runNowMutation.isPending ? "Running…" : "Run Compliance Sweep Now"}
            </button>
          }
        >
          <ul className="space-y-2">
            {allCourses.data?.map((course) => (
              <CourseAdminRow
                key={course.id}
                course={course}
                onPublish={(id) => publishMutation.mutate(id)}
                onArchive={(id) => archiveMutation.mutate(id)}
              />
            ))}
          </ul>
        </Card>
      )}

      <Card title="Published Courses">
        {enrollError && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{enrollError}</p>}
        {catalog.data?.length === 0 && <p className="text-ink-muted">No courses published yet.</p>}
        <ul className="space-y-2">
          {catalog.data?.map((course) => (
            <CourseCatalogRow
              key={course.id}
              course={course}
              enrollment={enrollmentByCourseId.get(course.id)}
              onEnroll={(id) => enrollMutation.mutate(id)}
              enrollPending={enrollMutation.isPending}
            />
          ))}
        </ul>
      </Card>
    </div>
  );
}
