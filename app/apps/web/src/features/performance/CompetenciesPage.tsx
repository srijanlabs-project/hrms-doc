import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { createCompetency, listCompetencyCatalog, listMyCompetencyAssessments } from "../../lib/api/performance";
import { getTeamDashboard } from "../../lib/api/team-dashboard";
import { useAuth } from "../auth/AuthProvider";
import { AssessCompetencyForm } from "./AssessCompetencyForm";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/**
 * Wave 3 W3·E11 Performance Management deepening — Competency framework
 * (docs/03-module-specifications/11-performance-management.md's
 * competencies catalog item). Admin-managed catalog; a manager rates each
 * direct report against it once per period, distinct from the already-built
 * 360 Feedback's multi-rater mechanism.
 */
export function CompetenciesPage() {
  const { user } = useAuth();
  const isAdmin = ADMIN_ROLES.some((role) => user?.roles.includes(role));
  const queryClient = useQueryClient();

  const catalog = useQuery({ queryKey: ["competency-catalog"], queryFn: listCompetencyCatalog });
  const mine = useQuery({ queryKey: ["competency-assessments-mine"], queryFn: listMyCompetencyAssessments });
  const team = useQuery({ queryKey: ["team-dashboard"], queryFn: getTeamDashboard });

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const createCompetencyMutation = useMutation({
    mutationFn: () => createCompetency({ name, description: description || undefined }),
    onSuccess: () => {
      setName("");
      setDescription("");
      void queryClient.invalidateQueries({ queryKey: ["competency-catalog"] });
    },
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Competencies</h1>
        <p className="text-ink-muted">Skill assessments against the organization's competency framework.</p>
      </header>

      {isAdmin && (
        <Card title="Competency Catalog">
          <form
            className="flex flex-wrap items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              createCompetencyMutation.mutate();
            }}
          >
            <input required placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="input" />
            <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="input flex-1" />
            <button type="submit" className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-hover">
              Add
            </button>
          </form>
          <ul className="mt-3 flex flex-wrap gap-2">
            {catalog.data?.map((c) => (
              <li key={c.id} className="rounded-lg border border-border px-2 py-1 text-xs">
                {c.name}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {(team.data?.roster.length ?? 0) > 0 && (
        <AssessCompetencyForm roster={team.data?.roster ?? []} catalog={catalog.data ?? []} />
      )}

      <Card title="My Assessments">
        <ul className="space-y-2">
          {mine.data?.map((a) => (
            <li key={a.id} className="rounded-lg border border-border p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">{a.competency.name}</span>
                <span className="text-xs text-ink-faint">
                  {a.periodYear} · Rating {a.rating}/5
                </span>
              </div>
              {a.comments && <p className="mt-1 text-xs text-ink-faint">{a.comments}</p>}
            </li>
          ))}
          {mine.data?.length === 0 && <p className="text-sm text-ink-faint">No competency assessments yet.</p>}
        </ul>
      </Card>
    </div>
  );
}
