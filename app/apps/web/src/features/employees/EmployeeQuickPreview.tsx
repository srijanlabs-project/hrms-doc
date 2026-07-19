import { ArrowRight, Mail, Phone, X } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Avatar } from "../../components/ui/Avatar";
import { Badge } from "../../components/ui/Badge";
import type { Employee } from "../../lib/api/types";
import { employeeStatusTone } from "./status-tone";

/**
 * Right context drawer per board T-003. Shows a quick preview only — full
 * detail (tabs, timeline, documents) lives on the T-004 360 page this links
 * to, so the two boards' content isn't duplicated in two places.
 */
export function EmployeeQuickPreview({
  employee,
  onClose,
}: {
  employee: Employee;
  onClose: () => void;
}) {
  return (
    <aside className="w-80 shrink-0 space-y-4 rounded-(--radius-card) border border-border bg-surface p-5 shadow-(--shadow-card)">
      <div className="flex items-start justify-between">
        <h2 className="font-semibold">Employee Details</h2>
        <button type="button" onClick={onClose} aria-label="Close" className="text-ink-faint hover:text-ink">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <Avatar name={employee.legalName} />
        <div>
          <div className="font-semibold">{employee.legalName}</div>
          <div className="text-xs text-ink-faint">{employee.employeeCode}</div>
        </div>
        <Badge tone={employeeStatusTone(employee.status)}>{employee.status}</Badge>
      </div>

      <dl className="space-y-2 text-xs">
        <Row label="Department" value={employee.department?.name ?? "Unassigned"} />
        {employee.personalEmail && (
          <Row label="Email" value={employee.personalEmail} icon={<Mail className="h-3.5 w-3.5" />} />
        )}
        {employee.mobileNumber && (
          <Row label="Phone" value={employee.mobileNumber} icon={<Phone className="h-3.5 w-3.5" />} />
        )}
        {employee.joiningDate && (
          <Row label="Join Date" value={new Date(employee.joiningDate).toLocaleDateString("en-IN")} />
        )}
      </dl>

      <Link
        to={`/people/employees/${employee.id}`}
        className="flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 font-semibold text-white hover:bg-primary-hover"
      >
        View 360° Profile <ArrowRight className="h-4 w-4" />
      </Link>
    </aside>
  );
}

function Row({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-border pb-2">
      <dt className="flex items-center gap-1.5 text-ink-faint">
        {icon}
        {label}
      </dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
