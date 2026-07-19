import { Avatar } from "../../components/ui/Avatar";
import { Badge } from "../../components/ui/Badge";
import type { Employee } from "../../lib/api/types";
import { employeeStatusTone } from "./status-tone";

export function EmployeeTable({
  employees,
  selectedId,
  onSelect,
}: {
  employees: Employee[];
  selectedId?: string;
  onSelect: (employee: Employee) => void;
}) {
  if (employees.length === 0) {
    return (
      <div className="rounded-(--radius-card) border border-border bg-surface p-8 text-center text-ink-muted">
        No employees match the current filters.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-(--radius-card) border border-border bg-surface">
      <table className="w-full text-left">
        <thead className="border-b border-border text-xs uppercase text-ink-faint">
          <tr>
            <th className="px-4 py-3 font-medium">Employee ID</th>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Department</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Join Date</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr
              key={employee.id}
              onClick={() => onSelect(employee)}
              className={`cursor-pointer border-b border-border last:border-0 hover:bg-primary-soft ${
                selectedId === employee.id ? "bg-primary-soft" : ""
              }`}
            >
              <td className="px-4 py-3 font-mono text-xs text-ink-muted">{employee.employeeCode}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Avatar name={employee.legalName} size="sm" />
                  {employee.legalName}
                </div>
              </td>
              <td className="px-4 py-3 text-ink-muted">{employee.department?.name ?? "Unassigned"}</td>
              <td className="px-4 py-3">
                <Badge tone={employeeStatusTone(employee.status)}>{employee.status}</Badge>
              </td>
              <td className="px-4 py-3 text-ink-muted">
                {employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString("en-IN") : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
