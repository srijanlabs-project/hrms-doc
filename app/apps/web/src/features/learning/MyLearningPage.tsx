import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { listMyEnrollments } from "../../lib/api/learning";
import { EnrollmentRow } from "./EnrollmentRow";
import { LearningPathsPanel } from "./LearningPathsPanel";
import { SkillDevelopmentPanel } from "./SkillDevelopmentPanel";
import { TeamMandatoryTrainingPanel } from "./TeamMandatoryTrainingPanel";

/** My Learning dashboard — self-service completion/withdrawal, plus assessment submission for courses that require one. */
export function MyLearningPage() {
  const enrollments = useQuery({ queryKey: ["learning-enrollments-my"], queryFn: listMyEnrollments });

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
            <EnrollmentRow key={enrollment.id} enrollment={enrollment} />
          ))}
        </ul>
      </Card>

      <LearningPathsPanel />
      <SkillDevelopmentPanel />
      <TeamMandatoryTrainingPanel />
    </div>
  );
}
