import { useQuery } from "@tanstack/react-query";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { getMySkillDevelopment } from "../../lib/api/learning";

/** W3·E12 gap closure ("skill development") — cross-references EmployeeSkill against completed/available course skillTags. */
export function SkillDevelopmentPanel() {
  const summary = useQuery({ queryKey: ["skill-development-mine"], queryFn: getMySkillDevelopment });

  return (
    <Card title="Skill Development">
      <div className="space-y-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">Skills You've Developed</p>
          {summary.data?.developedSkillTags.length === 0 && (
            <p className="text-sm text-ink-faint">Complete a skill-tagged course to see skills appear here.</p>
          )}
          <div className="flex flex-wrap gap-2">
            {summary.data?.developedSkillTags.map((tag) => (
              <Badge key={tag} tone="positive">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">Recommended For You</p>
          {summary.data?.recommendedCourses.length === 0 && (
            <p className="text-sm text-ink-faint">No recommendations yet — add skills to your profile or check back as new courses publish.</p>
          )}
          <ul className="space-y-1">
            {summary.data?.recommendedCourses.map((course) => (
              <li key={course.id} className="rounded-lg border border-border p-2 text-sm">
                <span className="font-medium">{course.title}</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {course.skillTags.map((tag) => (
                    <Badge key={tag} tone="neutral">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
