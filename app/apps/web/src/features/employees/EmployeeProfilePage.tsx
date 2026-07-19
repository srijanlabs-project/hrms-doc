import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { KpiCard } from "../../components/ui/KpiCard";
import { RidzAvatar } from "../../components/ui/RidzAvatar";
import { getEmployee } from "../../lib/api/employees";
import { EmployeeAboutSection } from "./EmployeeAboutSection";
import { EmployeeProfileHeader } from "./EmployeeProfileHeader";

const tabs = [
  "Overview",
  "Job & Career",
  "Compensation",
  "Performance",
  "Documents",
  "Assets",
  "Time Off",
  "More",
];

/**
 * T-004 360° Workspace. Only Overview is real: attendance, goals,
 * performance, documents, assets, and timeline all require modules that
 * don't exist yet (Attendance, Performance, Document, Employee Timeline —
 * see docs/08-submodule-specifications/02-people-management/15-employee-timeline.md
 * for the deferred activity-timeline design). Those surfaces show as
 * disabled tabs and labeled empty states rather than fabricated numbers.
 */
export function EmployeeProfilePage() {
  const { id } = useParams<{ id: string }>();
  const employee = useQuery({
    queryKey: ["employees", id],
    queryFn: () => getEmployee(id!),
    enabled: !!id,
  });

  if (employee.isLoading) return <p className="text-ink-muted">Loading employee…</p>;
  if (employee.isError || !employee.data) {
    return <p className="text-negative">Could not load this employee.</p>;
  }

  const data = employee.data;

  return (
    <div className="space-y-4">
      <EmployeeProfileHeader employee={data} />

      <div className="flex gap-1 overflow-x-auto border-b border-border">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            type="button"
            disabled={i !== 0}
            title={i !== 0 ? "Coming soon" : undefined}
            className={
              i === 0
                ? "border-b-2 border-primary px-4 py-2 font-medium text-primary"
                : "cursor-not-allowed px-4 py-2 font-medium text-ink-faint"
            }
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <KpiCard label="Attendance" value="—" caption="Requires Attendance module" />
            <KpiCard label="Goals Progress" value="—" caption="Requires Performance module" />
            <KpiCard label="Pending Tasks" value="—" caption="Requires Workflow module" />
            <KpiCard label="Total Leaves" value="—" caption="Requires Leave module" />
          </div>

          <EmployeeAboutSection employee={data} />

          <Card title="Activity Timeline">
            <p className="text-ink-muted">
              Timeline will appear here once the employee timeline service is connected.
            </p>
          </Card>
        </div>

        <aside className="hidden w-72 shrink-0 space-y-4 xl:block">
          <Card title="Quick Actions">
            <div className="space-y-2">
              {["Raise Request", "Generate Letter", "Add Note"].map((action) => (
                <button
                  key={action}
                  type="button"
                  disabled
                  title="Coming soon"
                  className="w-full cursor-not-allowed rounded-lg border border-border px-3 py-2 text-left text-ink-faint"
                >
                  {action}
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <div className="mb-2 flex items-center gap-2 font-semibold">
              <RidzAvatar size={28} />
              Ridz Insight
            </div>
            <p className="text-ink-muted">
              Ridz will surface insights here once more employee data is available.
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
}
