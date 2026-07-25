import { useQuery } from "@tanstack/react-query";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { checkBonusEligibility } from "../../lib/api/statutory-compliance";

function money(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}

/** Real Payment of Bonus Act computation: eligible employees (basic <= configured ceiling) get bonusPercent x annual eligible wage. */
export function BonusEligibilityPanel() {
  const check = useQuery({ queryKey: ["bonus-eligibility"], queryFn: checkBonusEligibility });
  const eligible = check.data?.filter((r) => r.eligible) ?? [];
  const totalBonus = eligible.reduce((sum, r) => sum + r.bonusAmount, 0);

  return (
    <Card title="Statutory Bonus Eligibility">
      {check.data && eligible.length === 0 && <p className="text-sm text-ink-faint">No active employees fall under the bonus ceiling.</p>}
      {eligible.length > 0 && (
        <>
          <p className="mb-2 text-sm text-ink-muted">
            {eligible.length} eligible employee{eligible.length === 1 ? "" : "s"} — total statutory bonus {money(totalBonus)}. Grant via
            Incentives &amp; Bonus once approved.
          </p>
          <ul className="space-y-1">
            {eligible.map((r) => (
              <li key={r.employeeId} className="flex items-center justify-between rounded-lg border border-border p-2 text-sm">
                <span>
                  {r.legalName} <span className="font-mono text-xs text-ink-faint">({r.employeeCode})</span> — basic{" "}
                  {money(r.monthlyBasic)}
                </span>
                <Badge tone="info">{money(r.bonusAmount)}</Badge>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}
