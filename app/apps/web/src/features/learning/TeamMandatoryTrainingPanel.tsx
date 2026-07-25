import { useQuery } from "@tanstack/react-query";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { listTeamMandatoryEnrollments } from "../../lib/api/learning";
import { enrollmentStatusTone } from "./status-tone";

/** Manager escalation view — direct reports' system-assigned mandatory training, per 03-compliance-training.md. */
export function TeamMandatoryTrainingPanel() {
  const enrollments = useQuery({ queryKey: ["learning-enrollments-team"], queryFn: listTeamMandatoryEnrollments });

  if (!enrollments.data || enrollments.data.length === 0) return null;

  return (
    <Card title="Team Compliance Training">
      <ul className="space-y-2">
        {enrollments.data.map((enrollment) => (
          <li key={enrollment.id} className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <span className="font-medium">{enrollment.employee.legalName}</span>
              <span className="text-ink-faint"> — {enrollment.course.title}</span>
              {enrollment.dueDate && (
                <p className="mt-1 text-xs text-ink-faint">
                  Due {new Date(enrollment.dueDate).toLocaleDateString("en-IN")}
                </p>
              )}
            </div>
            <Badge tone={enrollmentStatusTone(enrollment.status)}>{enrollment.status}</Badge>
          </li>
        ))}
      </ul>
    </Card>
  );
}
