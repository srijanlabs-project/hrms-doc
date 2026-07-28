import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { enrollInWellnessProgram, listWellnessPrograms } from "../../lib/api/experience";

/** Self-service: browse and enroll in wellness programs. */
export function WellnessPanel() {
  const queryClient = useQueryClient();
  const programs = useQuery({ queryKey: ["wellness-programs"], queryFn: listWellnessPrograms });
  const enroll = useMutation({
    mutationFn: (id: string) => enrollInWellnessProgram(id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["wellness-programs"] }),
  });

  return (
    <Card title="Wellness Programs">
      <ul className="grid gap-2 sm:grid-cols-2">
        {programs.data?.map((p) => (
          <li key={p.id} className="rounded-lg border border-border p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">{p.title}</span>
              <Badge tone="info">{p.category}</Badge>
            </div>
            {p.description && <p className="mt-1 text-xs text-ink-faint">{p.description}</p>}
            <p className="mt-1 text-xs text-ink-faint">
              From {new Date(p.startDate).toLocaleDateString("en-IN")}
              {p.endDate ? ` to ${new Date(p.endDate).toLocaleDateString("en-IN")}` : ""}
            </p>
            <button
              type="button"
              disabled={enroll.isPending || p.isEnrolled}
              onClick={() => enroll.mutate(p.id)}
              className="mt-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
            >
              {p.isEnrolled ? "Enrolled" : "Enroll"}
            </button>
          </li>
        ))}
        {programs.data?.length === 0 && <p className="text-ink-muted">No wellness programs yet.</p>}
      </ul>
    </Card>
  );
}
