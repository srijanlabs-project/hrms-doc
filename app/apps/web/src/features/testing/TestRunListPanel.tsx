import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { listTestRuns } from "../../lib/api/testing";
import { TestRunDetail } from "./TestRunDetail";

export function TestRunListPanel() {
  const runs = useQuery({ queryKey: ["test-runs"], queryFn: listTestRuns });
  const [openRunId, setOpenRunId] = useState<string | null>(null);

  if (openRunId) {
    return <TestRunDetail runId={openRunId} onBack={() => setOpenRunId(null)} />;
  }

  return (
    <Card title="Test Runs">
      <ul className="space-y-2">
        {runs.data?.map((run) => (
          <li key={run.id} className="rounded-lg border border-border p-3">
            <button type="button" onClick={() => setOpenRunId(run.id)} className="flex w-full items-center justify-between text-left">
              <span>
                <span className="font-medium">{run.suite.name}</span>{" "}
                <Badge tone={run.status === "SignedOff" ? "positive" : "info"}>{run.status}</Badge>
              </span>
              <span className="text-xs text-ink-faint">
                {run.results.filter((r) => r.outcome !== "Pending").length}/{run.results.length} decided
              </span>
            </button>
          </li>
        ))}
        {runs.data?.length === 0 && <p className="text-ink-muted">No test runs yet.</p>}
      </ul>
    </Card>
  );
}
