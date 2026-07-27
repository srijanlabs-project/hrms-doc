import type { ReportDefinition } from "../../lib/api/analytics";

export function SavedReportsPanel({
  definitions,
  onRun,
  onDelete,
}: {
  definitions: ReportDefinition[];
  onRun: (definition: ReportDefinition) => void;
  onDelete: (id: string) => void;
}) {
  if (definitions.length === 0) {
    return <p className="text-sm text-ink-faint">No saved reports yet.</p>;
  }

  return (
    <ul className="space-y-2">
      {definitions.map((definition) => (
        <li
          key={definition.id}
          className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
        >
          <div>
            <div className="font-semibold">{definition.name}</div>
            <div className="text-xs text-ink-faint">
              {definition.entityType} · {definition.selectedFields.length} field(s)
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onRun(definition)}
              className="rounded-lg border border-border px-2 py-1 text-xs font-semibold hover:bg-primary-soft"
            >
              Run
            </button>
            <button
              onClick={() => onDelete(definition.id)}
              className="rounded-lg border border-border px-2 py-1 text-xs font-semibold text-negative hover:bg-negative-soft"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
