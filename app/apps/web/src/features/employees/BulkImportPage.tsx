import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { useAuth } from "../auth/AuthProvider";
import { bulkImportEmployees } from "../../lib/api/employees";

const IMPORT_ADMIN_ROLES = ["org_admin", "hr_ops"];
const SAMPLE_CSV = "employeeCode,legalName,personalEmail,joiningDate\nENG-101,Aisha Khan,aisha.khan@example.com,2026-08-15";

/**
 * Bulk import workbench (T-006 pattern), Phase 6. Simple CSV parsing — no
 * quoted-field escaping, no column mapping UI, no dedupe-preview pass; each
 * row runs through the exact same CreateEmployeeDto rules as the single-add
 * form (see EmployeeService.bulkCreate), so partial success is expected and
 * shown per row rather than treated as a failure.
 */
export function BulkImportPage() {
  const { user } = useAuth();
  const isAdmin = IMPORT_ADMIN_ROLES.some((role) => user?.roles.includes(role));
  const [csv, setCsv] = useState("");
  const [rows, setRows] = useState<Record<string, unknown>[] | null>(null);

  const importMutation = useMutation({ mutationFn: (r: Record<string, unknown>[]) => bulkImportEmployees(r) });

  if (!isAdmin) {
    return (
      <div className="rounded-(--radius-card) border border-border bg-surface p-8 text-center text-ink-muted">
        Bulk import is restricted to HR Operations and Org Admin roles.
      </div>
    );
  }

  function parseCsv() {
    const lines = csv.trim().split("\n").filter((line) => line.trim().length > 0);
    if (lines.length < 2) {
      setRows([]);
      return;
    }
    const headers = lines[0].split(",").map((h) => h.trim());
    const parsed = lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim());
      const row: Record<string, unknown> = {};
      headers.forEach((header, i) => {
        if (values[i]) row[header] = values[i];
      });
      return row;
    });
    setRows(parsed);
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Bulk Import Employees</h1>
        <p className="text-ink-muted">Paste CSV data to create multiple employee records at once.</p>
      </header>

      <Card title="1. Paste CSV">
        <p className="mb-2 text-xs text-ink-faint">
          First row must be a header. Supported columns: employeeCode, legalName, preferredName, dateOfBirth,
          personalEmail, mobileNumber, departmentId, managerId, joiningDate.
        </p>
        <textarea
          value={csv}
          onChange={(e) => setCsv(e.target.value)}
          placeholder={SAMPLE_CSV}
          rows={8}
          className="input w-full font-mono text-xs"
        />
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={parseCsv}
            className="rounded-lg border border-border px-4 py-2 font-medium hover:border-primary"
          >
            Preview
          </button>
          <button
            type="button"
            onClick={() => setCsv(SAMPLE_CSV)}
            className="rounded-lg border border-border px-4 py-2 text-xs font-medium hover:border-primary"
          >
            Load Sample
          </button>
        </div>
      </Card>

      {rows && (
        <Card
          title={`2. Preview (${rows.length} row(s))`}
          action={
            rows.length > 0 && (
              <button
                type="button"
                disabled={importMutation.isPending}
                onClick={() => importMutation.mutate(rows)}
                className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
              >
                {importMutation.isPending ? "Importing…" : "Import All"}
              </button>
            )
          }
        >
          {rows.length === 0 ? (
            <p className="text-ink-muted">No data rows found — check the CSV has a header row plus at least one data row.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead className="text-xs uppercase text-ink-faint">
                  <tr>
                    {Object.keys(rows[0]).map((key) => (
                      <th key={key} className="pb-2 pr-4">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map((row, i) => (
                    <tr key={i}>
                      {Object.keys(rows[0]).map((key) => (
                        <td key={key} className="py-2 pr-4">
                          {String(row[key] ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {importMutation.data && (
        <Card title="3. Results">
          <ul className="space-y-2">
            {importMutation.data.map((result) => (
              <li key={result.index} className="flex items-center justify-between gap-2 rounded-lg border border-border p-3">
                <span className="text-sm">
                  Row {result.index + 1}
                  {result.employeeCode && <span className="text-ink-faint"> · {result.employeeCode}</span>}
                </span>
                {result.success ? (
                  <Badge tone="positive">Created</Badge>
                ) : (
                  <span className="flex items-center gap-2">
                    <Badge tone="negative">Failed</Badge>
                    <span className="text-xs text-negative">{result.error}</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
