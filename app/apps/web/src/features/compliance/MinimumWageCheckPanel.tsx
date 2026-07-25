import { useQuery } from "@tanstack/react-query";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { checkMinimumWages } from "../../lib/api/statutory-compliance";

function money(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}

/** Real computed check: flags any active employee whose monthly basic is below the tenant's configured threshold. */
export function MinimumWageCheckPanel() {
  const check = useQuery({ queryKey: ["minimum-wage-check"], queryFn: checkMinimumWages });
  const violations = check.data?.filter((r) => r.violation) ?? [];

  return (
    <Card title="Minimum Wage Compliance">
      {check.data && check.data.length === 0 && <p className="text-sm text-ink-faint">No active employees with compensation on file.</p>}
      {violations.length === 0 && check.data && check.data.length > 0 && (
        <p className="text-sm text-positive">All active employees meet the configured minimum wage threshold.</p>
      )}
      <ul className="space-y-1">
        {violations.map((r) => (
          <li key={r.employeeId} className="flex items-center justify-between rounded-lg border border-border p-2 text-sm">
            <span>
              {r.legalName} <span className="font-mono text-xs text-ink-faint">({r.employeeCode})</span> — basic {money(r.monthlyBasic)}{" "}
              vs threshold {money(r.threshold)}
            </span>
            <Badge tone="negative">Below Threshold</Badge>
          </li>
        ))}
      </ul>
    </Card>
  );
}
