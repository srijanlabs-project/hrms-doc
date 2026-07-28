import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { getPermissionsMatrix } from "../../lib/api/permissions-matrix";

/**
 * W1·E03 Identity and Access — permissions matrix. Reads the app's real,
 * running @Roles()/@Public() decorator metadata (see PermissionsMatrixService),
 * so this table can never drift from the actual authorization gates — no
 * hand-maintained document to keep in sync.
 */
export function PermissionsMatrixPage() {
  const matrix = useQuery({ queryKey: ["permissions-matrix"], queryFn: getPermissionsMatrix });
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const rows = matrix.data ?? [];
    const term = search.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter(
      (r) => r.module.toLowerCase().includes(term) || r.path.toLowerCase().includes(term) || r.access.toLowerCase().includes(term),
    );
  }, [matrix.data, search]);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Permissions Matrix</h1>
      <Card title={`Routes (${filtered.length}${matrix.data ? ` of ${matrix.data.length}` : ""})`}>
        <input
          placeholder="Filter by module, path, or role…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input mb-3 w-full"
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-ink-faint">
                <th className="py-2 pr-4">Module</th>
                <th className="py-2 pr-4">Method</th>
                <th className="py-2 pr-4">Path</th>
                <th className="py-2">Access</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={`${row.method}-${row.path}-${i}`} className="border-b border-border">
                  <td className="py-1.5 pr-4 font-medium">{row.module}</td>
                  <td className="py-1.5 pr-4 font-mono text-xs">{row.method}</td>
                  <td className="py-1.5 pr-4 font-mono text-xs">{row.path}</td>
                  <td className="py-1.5">
                    <Badge tone={row.access === "Public (no auth)" ? "warning" : row.access === "Any authenticated user" ? "neutral" : "info"}>
                      {row.access}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="py-4 text-center text-sm text-ink-faint">No routes match this filter.</p>}
        </div>
      </Card>
    </div>
  );
}
