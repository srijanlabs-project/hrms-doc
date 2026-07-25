import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { KpiCard } from "../../components/ui/KpiCard";
import { RidzAvatar } from "../../components/ui/RidzAvatar";
import { useAuth } from "../auth/AuthProvider";
import { getEmployee } from "../../lib/api/employees";
import { ActivityTimeline } from "./ActivityTimeline";
import { CompensationTab } from "./CompensationTab";
import { DocumentsTab } from "./DocumentsTab";
import { EmployeeAboutSection } from "./EmployeeAboutSection";
import { EmployeeProfileHeader } from "./EmployeeProfileHeader";
import { GenerateLetterCard } from "./GenerateLetterCard";
import { JobCareerTab } from "./JobCareerTab";
import { MoreTab } from "./MoreTab";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { ProxyLoginCard } from "./ProxyLoginCard";
import { SeparateEmployeeCard } from "./SeparateEmployeeCard";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

const tabs = [
  "Overview",
  "Job & Career",
  "Compensation",
  "Performance",
  "Documents",
  "Assets",
  "Time Off",
  "More",
] as const;

const DISABLED_TABS = new Set(["Performance", "Assets", "Time Off"]);

/**
 * T-004 360° Workspace. Overview, Job & Career, Compensation, Documents, and
 * More are wired to the People Management deepening (personal info, career
 * movements, salary revisions, bank/tax, employee/identity documents,
 * education/experience/certifications/skills). Performance, Assets, and Time
 * Off require modules out of this pass's scope and stay disabled.
 */
export function EmployeeProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const isAdmin = ADMIN_ROLES.some((role) => user?.roles.includes(role));
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Overview");
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
        {tabs.map((tab) => {
          const disabled = DISABLED_TABS.has(tab);
          const active = tab === activeTab;
          return (
            <button
              key={tab}
              type="button"
              disabled={disabled}
              title={disabled ? "Coming soon" : undefined}
              onClick={() => setActiveTab(tab)}
              className={
                disabled
                  ? "cursor-not-allowed px-4 py-2 font-medium text-ink-faint"
                  : active
                    ? "border-b-2 border-primary px-4 py-2 font-medium text-primary"
                    : "px-4 py-2 font-medium text-ink-muted hover:text-ink"
              }
            >
              {tab}
            </button>
          );
        })}
      </div>

      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1 space-y-4">
          {activeTab === "Overview" && (
            <>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <KpiCard label="Attendance" value="—" caption="Requires Attendance module" />
                <KpiCard label="Goals Progress" value="—" caption="Requires Performance module" />
                <KpiCard label="Pending Tasks" value="—" caption="Requires Workflow module" />
                <KpiCard label="Total Leaves" value="—" caption="Requires Leave module" />
              </div>

              <EmployeeAboutSection employee={data} />
              <PersonalInfoSection employeeId={data.id} />
              <ActivityTimeline employeeId={data.id} />
            </>
          )}

          {activeTab === "Job & Career" && <JobCareerTab employeeId={data.id} isAdmin={isAdmin} />}
          {activeTab === "Compensation" && <CompensationTab employeeId={data.id} isAdmin={isAdmin} />}
          {activeTab === "Documents" && <DocumentsTab employeeId={data.id} />}
          {activeTab === "More" && <MoreTab employeeId={data.id} />}
        </div>

        <aside className="hidden w-72 shrink-0 space-y-4 xl:block">
          <Card title="Quick Actions">
            <div className="space-y-2">
              {["Raise Request", "Add Note"].map((action) => (
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

          <GenerateLetterCard employeeId={data.id} />

          {isAdmin && data.id !== user?.employeeId && <ProxyLoginCard employeeId={data.id} employeeName={data.legalName} />}

          {isAdmin && <SeparateEmployeeCard employee={data} />}

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
