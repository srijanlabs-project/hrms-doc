import { Badge } from "../../components/ui/Badge";
import type { LearningCourse } from "../../lib/api/types";
import { courseStatusTone } from "./status-tone";

export function CourseAdminRow({
  course,
  onPublish,
  onArchive,
}: {
  course: LearningCourse;
  onPublish: (id: string) => void;
  onArchive: (id: string) => void;
}) {
  return (
    <li className="flex items-center justify-between rounded-lg border border-border p-3">
      <div>
        <span className="font-medium">{course.title}</span> <Badge tone={courseStatusTone(course.status)}>{course.status}</Badge>
        <p className="mt-1 text-xs text-ink-faint">
          {course.durationHours}h {course.isMandatory && "· Mandatory"}
        </p>
      </div>
      <div className="flex gap-2">
        {course.status === "Draft" && (
          <button
            type="button"
            onClick={() => onPublish(course.id)}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
          >
            Publish
          </button>
        )}
        {course.status === "Published" && (
          <button
            type="button"
            onClick={() => onArchive(course.id)}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover"
          >
            Archive
          </button>
        )}
      </div>
    </li>
  );
}
