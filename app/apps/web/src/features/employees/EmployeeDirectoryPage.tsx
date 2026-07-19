import { useQuery } from "@tanstack/react-query";
import { Filter, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Card } from "../../components/ui/Card";
import { listDepartments } from "../../lib/api/departments";
import { listEmployees } from "../../lib/api/employees";
import type { Employee } from "../../lib/api/types";
import { CreateEmployeeForm } from "./CreateEmployeeForm";
import { EmployeeQuickPreview } from "./EmployeeQuickPreview";
import { EmployeeTable } from "./EmployeeTable";

/**
 * T-003 Enterprise Workbench — master list + filters + right context drawer.
 * Board also specifies its own Data Management navigation (Employees,
 * Contractors, Departments, Locations, Assets, Documents) as part of the
 * WS-03 HR Workspace shell; that dedicated shell is a separate deliverable
 * and out of Phase 2 scope, so this page runs inside the existing shell for
 * now, reachable from Resources > Employees.
 */
export function EmployeeDirectoryPage() {
  const [search, setSearch] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<Employee | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const employees = useQuery({ queryKey: ["employees"], queryFn: listEmployees });
  const departments = useQuery({ queryKey: ["departments"], queryFn: listDepartments });

  const filtered = useMemo(() => {
    return (employees.data ?? []).filter((e) => {
      const matchesSearch =
        !search ||
        e.legalName.toLowerCase().includes(search.toLowerCase()) ||
        e.employeeCode.toLowerCase().includes(search.toLowerCase());
      const matchesDept = !departmentId || e.departmentId === departmentId;
      const matchesStatus = !statusFilter || e.status === statusFilter;
      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [employees.data, search, departmentId, statusFilter]);

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Employees</h1>
          <p className="text-ink-muted">Manage and explore your employee records.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover"
        >
          <Plus className="h-4 w-4" /> Add Employee
        </button>
      </header>

      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex min-w-64 flex-1 items-center gap-2 rounded-lg border border-border px-3 py-2">
            <Search className="h-4 w-4 text-ink-faint" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or employee code…"
              className="w-full bg-transparent outline-none placeholder:text-ink-faint"
            />
          </div>

          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            className="rounded-lg border border-border px-3 py-2"
          >
            <option value="">All Departments</option>
            {departments.data?.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-border px-3 py-2"
          >
            <option value="">All Status</option>
            {["Draft", "Pre-Active", "Active", "Suspended", "Separated", "Archived"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            type="button"
            disabled
            title="Advanced filters — coming soon"
            className="flex cursor-not-allowed items-center gap-2 rounded-lg border border-border px-3 py-2 text-ink-faint"
          >
            <Filter className="h-4 w-4" /> More Filters
          </button>
        </div>
      </Card>

      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1 space-y-3">
          {employees.isLoading && <p className="text-ink-muted">Loading employees…</p>}
          {employees.isError && (
            <p className="text-negative">Could not load employees. Is the API running?</p>
          )}
          {employees.data && (
            <>
              <EmployeeTable
                employees={filtered}
                selectedId={selected?.id}
                onSelect={setSelected}
              />
              <p className="text-xs text-ink-faint">
                Showing {filtered.length} of {employees.data.length} employees
              </p>
            </>
          )}
        </div>

        {selected && (
          <EmployeeQuickPreview employee={selected} onClose={() => setSelected(null)} />
        )}
      </div>

      {showCreate && <CreateEmployeeForm onClose={() => setShowCreate(false)} />}
    </div>
  );
}
