import { Badge } from "../../components/ui/Badge";
import type { LearningCourse, LearningEnrollment } from "../../lib/api/types";

export function CourseCatalogRow({
  course,
  enrollment,
  onEnroll,
  enrollPending,
}: {
  course: LearningCourse;
  enrollment: LearningEnrollment | undefined;
  onEnroll: (courseId: string) => void;
  enrollPending: boolean;
}) {
  return (
    <li className="flex items-center justify-between rounded-lg border border-border p-3">
      <div>
        <span className="font-medium">{course.title}</span>
        {course.isMandatory && <Badge tone="warning">Mandatory</Badge>}
        {course.description && <p className="mt-1 text-xs text-ink-faint">{course.description}</p>}
        <p className="mt-1 text-xs text-ink-faint">{course.durationHours}h</p>
      </div>
      {enrollment ? (
        <Badge tone={enrollment.status === "Completed" ? "positive" : "info"}>{enrollment.status}</Badge>
      ) : (
        <button
          type="button"
          disabled={enrollPending}
          onClick={() => onEnroll(course.id)}
          className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          Enroll
        </button>
      )}
    </li>
  );
}
