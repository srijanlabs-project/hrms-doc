import { useQuery } from "@tanstack/react-query";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { listMyEsopGrants } from "../../lib/api/esop";

/** Self-service: view my ESOP grants and live-computed vested units. No exercise/transaction ledger — see EsopService comment. */
export function EsopMyPanel() {
  const grants = useQuery({ queryKey: ["esop-grants-my"], queryFn: listMyEsopGrants });

  if (grants.data?.length === 0) return null;

  return (
    <Card title="My ESOP Grants">
      <ul className="space-y-2">
        {grants.data?.map((g) => (
          <li key={g.id} className="rounded-lg border border-border p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">{g.totalUnits.toLocaleString("en-IN")} units</span>
              <Badge tone={g.status === "Active" ? "positive" : "neutral"}>{g.status}</Badge>
            </div>
            <p className="mt-1 text-xs text-ink-faint">
              Granted {new Date(g.grantDate).toLocaleDateString("en-IN")} · Vesting starts{" "}
              {new Date(g.vestingStartDate).toLocaleDateString("en-IN")} over {g.vestingYears}y ({g.cliffMonths}mo cliff)
            </p>
            <p className="mt-1 text-sm">
              <span className="font-semibold text-positive">{g.vestedUnits.toLocaleString("en-IN")}</span> vested of{" "}
              {g.totalUnits.toLocaleString("en-IN")} as of today
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
