import { useQuery } from "@tanstack/react-query";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { listMyLicenseAssignments } from "../../lib/api/software-license";

/** Self-service read-only view, mirrors "My Assets". */
export function MyLicensesPanel() {
  const assignments = useQuery({ queryKey: ["license-assignments-my"], queryFn: listMyLicenseAssignments });

  if (assignments.data?.length === 0) return null;

  return (
    <Card title="My Software Licenses">
      <ul className="space-y-2">
        {assignments.data?.map((a) => (
          <li key={a.id} className="flex items-center justify-between rounded-lg border border-border p-3">
            <span>
              {a.license.name}
              {a.license.vendor && <span className="text-xs text-ink-faint"> · {a.license.vendor}</span>}
            </span>
            <Badge tone={a.status === "Active" ? "positive" : "neutral"}>{a.status}</Badge>
          </li>
        ))}
      </ul>
    </Card>
  );
}
