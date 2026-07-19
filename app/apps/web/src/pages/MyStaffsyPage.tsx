import { useQuery } from "@tanstack/react-query";
import { Card } from "../components/ui/Card";
import { KpiCard } from "../components/ui/KpiCard";

/**
 * T-001 My Staffsy Workspace — employee landing page.
 * Layout skeleton per board T001: greeting header, KPI row, actions, widgets.
 * Data is placeholder until the People/Leave services exist; the health card
 * proves the web → API wiring end to end.
 */
export function MyStaffsyPage() {
  const health = useQuery({
    queryKey: ["health"],
    queryFn: async (): Promise<{ data: { status: string; service: string } }> => {
      const res = await fetch("/api/v1/health");
      if (!res.ok) throw new Error(`API unreachable (${res.status})`);
      return res.json();
    },
    retry: 1,
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Good morning 👋</h1>
        <p className="text-ink-muted">Here is your day at a glance.</p>
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <KpiCard label="Leave Balance" value="—" caption="Days available" />
        <KpiCard label="Attendance" value="—" caption="This month" />
        <KpiCard label="Pending Tasks" value="—" caption="Tasks" />
        <KpiCard label="Requests" value="—" caption="Open requests" />
        <KpiCard label="Payslip" value="—" caption="Latest period" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="My Tasks">
          <p className="text-ink-muted">
            Tasks will appear here once the workflow service is connected.
          </p>
        </Card>
        <Card title="Platform Status">
          {health.isLoading && <p className="text-ink-muted">Checking API…</p>}
          {health.isError && (
            <p className="font-medium text-negative">
              API offline — start it with <code>npm run dev:api</code>
            </p>
          )}
          {health.data && (
            <p className="font-medium text-positive">
              {health.data.data.service} is {health.data.data.status}
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
