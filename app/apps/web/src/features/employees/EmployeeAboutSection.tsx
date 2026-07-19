import { Card } from "../../components/ui/Card";
import type { Employee } from "../../lib/api/types";

function formatDate(value: string | null): string {
  return value ? new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
}

export function EmployeeAboutSection({ employee }: { employee: Employee }) {
  const rows: [string, string][] = [
    ["Employee Code", employee.employeeCode],
    ["Status", employee.status],
    ["Date of Birth", formatDate(employee.dateOfBirth)],
    ["Personal Email", employee.personalEmail ?? "—"],
    ["Mobile Number", employee.mobileNumber ?? "—"],
    ["Department", employee.department?.name ?? "Unassigned"],
    ["Join Date", formatDate(employee.joiningDate)],
  ];

  return (
    <Card title={`About ${employee.preferredName ?? employee.legalName}`}>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs text-ink-faint">{label}</dt>
            <dd className="font-medium">{value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
