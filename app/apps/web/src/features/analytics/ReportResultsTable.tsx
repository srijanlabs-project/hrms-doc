export function ReportResultsTable({ fields, rows }: { fields: string[]; rows: Record<string, unknown>[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-ink-faint">Run the report to see results here.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-wide text-ink-faint">
            {fields.map((field) => (
              <th key={field} className="whitespace-nowrap py-2 pr-4">
                {field}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b border-border/60">
              {fields.map((field) => (
                <td key={field} className="whitespace-nowrap py-2 pr-4 tabular-nums">
                  {row[field] === null || row[field] === undefined ? "—" : String(row[field])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-xs text-ink-faint">{rows.length} row(s)</p>
    </div>
  );
}
