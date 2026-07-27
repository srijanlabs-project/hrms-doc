import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { KpiCard } from "../../components/ui/KpiCard";
import { getWorkforceTrend } from "../../lib/api/analytics";
import { useAuth } from "../auth/AuthProvider";
import { TrendBarChart } from "./TrendBarChart";

const ADMIN_ROLES = ["org_admin", "hr_ops"];
const MONTH_OPTIONS = [6, 12, 24];

function monthLabel(month: string): string {
  const [year, m] = month.split("-");
  return new Date(Number(year), Number(m) - 1, 1).toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
}

/**
 * W5·E25 Analytics and BI — workforce headcount/attrition trend. Live-computed
 * from Employee.joiningDate/lastWorkingDay for the trailing N months, not a
 * persisted analytics_snapshot table (see WorkforceAnalyticsService).
 */
export function WorkforceAnalyticsPage() {
  const { user } = useAuth();
  const isAdmin = ADMIN_ROLES.some((role) => user?.roles.includes(role));
  const [months, setMonths] = useState(12);

  const trend = useQuery({
    queryKey: ["workforce-trend", months],
    queryFn: () => getWorkforceTrend(months),
    enabled: isAdmin,
  });

  if (!isAdmin) {
    return (
      <div className="rounded-(--radius-card) border border-border bg-surface p-8 text-center text-ink-muted">
        Workforce Analytics is restricted to HR Operations and Org Admin roles.
      </div>
    );
  }

  const points = trend.data ?? [];
  const latest = points.at(-1);
  const earliest = points[0];
  const headcountChange = latest && earliest ? latest.headcount - earliest.headcount : 0;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Workforce Analytics</h1>
          <p className="text-ink-muted">Headcount and attrition trend, computed live from employee records.</p>
        </div>
        <div className="flex gap-1 rounded-lg border border-border bg-surface p-1">
          {MONTH_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => setMonths(option)}
              className={`rounded-md px-3 py-1 text-xs font-semibold ${
                months === option ? "bg-primary text-white" : "text-ink-muted hover:bg-primary-soft"
              }`}
            >
              {option}mo
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard label="Current Headcount" value={String(latest?.headcount ?? 0)} />
        <KpiCard
          label={`Headcount Change (${months}mo)`}
          value={`${headcountChange >= 0 ? "+" : ""}${headcountChange}`}
        />
        <KpiCard label="Latest Attrition Rate" value={`${latest?.attritionRate ?? 0}%`} caption="Separations / headcount, monthly" />
      </div>

      <Card title="Headcount Trend">
        <TrendBarChart bars={points.map((p) => ({ label: monthLabel(p.month), value: p.headcount }))} />
      </Card>

      <Card title="Monthly Separations">
        <TrendBarChart bars={points.map((p) => ({ label: monthLabel(p.month), value: p.separations }))} />
      </Card>
    </div>
  );
}
