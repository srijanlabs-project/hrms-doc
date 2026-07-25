import { useQuery } from "@tanstack/react-query";
import { Card } from "../../components/ui/Card";
import { computeLwfLiability } from "../../lib/api/statutory-compliance";

function money(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}

/** Live-computed Labour Welfare Fund liability: active headcount x configured per-employee contribution, no persisted ledger. */
export function LwfLiabilityPanel() {
  const liability = useQuery({ queryKey: ["lwf-liability"], queryFn: computeLwfLiability });
  if (!liability.data) return null;
  const d = liability.data;

  return (
    <Card title="Labour Welfare Fund Liability">
      <p className="text-sm text-ink-muted">
        {d.activeEmployeeCount} active employee{d.activeEmployeeCount === 1 ? "" : "s"}, contribution due every {d.frequencyMonths}{" "}
        month{d.frequencyMonths === 1 ? "" : "s"}.
      </p>
      <div className="mt-2 grid grid-cols-3 gap-3 text-sm">
        <div className="rounded-lg border border-border p-2">
          <div className="text-xs text-ink-faint">Employee share</div>
          <div className="font-semibold">{money(d.employeeContribution)}</div>
        </div>
        <div className="rounded-lg border border-border p-2">
          <div className="text-xs text-ink-faint">Employer share</div>
          <div className="font-semibold">{money(d.employerContribution)}</div>
        </div>
        <div className="rounded-lg border border-border p-2">
          <div className="text-xs text-ink-faint">Total liability</div>
          <div className="font-semibold text-primary">{money(d.totalLiability)}</div>
        </div>
      </div>
    </Card>
  );
}
