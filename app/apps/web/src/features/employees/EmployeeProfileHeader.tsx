import { ChevronLeft, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../../components/ui/Badge";
import type { Employee } from "../../lib/api/types";
import { employeeStatusTone } from "./status-tone";

export function EmployeeProfileHeader({ employee }: { employee: Employee }) {
  return (
    <div className="space-y-4">
      <Link to="/people/employees" className="flex w-fit items-center gap-1 text-sm text-ink-muted hover:text-primary">
        <ChevronLeft className="h-4 w-4" /> Back to Employees
      </Link>

      <div className="flex items-start justify-between rounded-(--radius-card) border border-border bg-surface p-6 shadow-(--shadow-card)">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-xl font-bold text-primary">
            {employee.legalName
              .split(" ")
              .map((p) => p[0])
              .slice(0, 2)
              .join("")}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{employee.legalName}</h1>
              <Badge tone={employeeStatusTone(employee.status)}>{employee.status}</Badge>
            </div>
            <p className="text-ink-muted">
              {employee.department?.name ?? "Unassigned"} · {employee.employeeCode}
            </p>
            <div className="mt-1 flex items-center gap-4 text-xs text-ink-faint">
              {employee.personalEmail && (
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" /> {employee.personalEmail}
                </span>
              )}
              {employee.mobileNumber && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" /> {employee.mobileNumber}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            disabled
            title="Coming soon"
            className="cursor-not-allowed rounded-lg border border-border px-4 py-2 font-medium text-ink-faint"
          >
            Edit Profile
          </button>
          <button
            type="button"
            disabled
            title="Coming soon"
            className="cursor-not-allowed rounded-lg border border-border px-4 py-2 font-medium text-ink-faint"
          >
            More Actions
          </button>
        </div>
      </div>
    </div>
  );
}
