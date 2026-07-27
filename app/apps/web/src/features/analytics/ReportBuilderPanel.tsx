import { useState } from "react";
import type { EntityFieldSet, ReportableEntityType } from "../../lib/api/analytics";

export interface BuilderState {
  entityType: ReportableEntityType;
  selectedFields: string[];
  filters: Record<string, string>;
}

export function ReportBuilderPanel({
  entitySets,
  state,
  onChange,
  onRun,
  onSave,
  onExport,
  isRunning,
}: {
  entitySets: EntityFieldSet[];
  state: BuilderState;
  onChange: (next: BuilderState) => void;
  onRun: () => void;
  onSave: (name: string) => void;
  onExport: () => void;
  isRunning: boolean;
}) {
  const [reportName, setReportName] = useState("");
  const availableFields = entitySets.find((set) => set.entityType === state.entityType)?.fields ?? [];

  function toggleField(field: string) {
    const next = state.selectedFields.includes(field)
      ? state.selectedFields.filter((f) => f !== field)
      : [...state.selectedFields, field];
    onChange({ ...state, selectedFields: next });
  }

  function setFilter(field: string, value: string) {
    const next = { ...state.filters };
    if (value === "") {
      delete next[field];
    } else {
      next[field] = value;
    }
    onChange({ ...state, filters: next });
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">Data source</label>
        <select
          value={state.entityType}
          onChange={(e) =>
            onChange({ entityType: e.target.value as ReportableEntityType, selectedFields: [], filters: {} })
          }
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm"
        >
          {entitySets.map((set) => (
            <option key={set.entityType} value={set.entityType}>
              {set.entityType}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">Fields</label>
        <div className="flex flex-wrap gap-2">
          {availableFields.map((field) => (
            <label
              key={field}
              className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-medium ${
                state.selectedFields.includes(field)
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border text-ink-muted"
              }`}
            >
              <input
                type="checkbox"
                className="hidden"
                checked={state.selectedFields.includes(field)}
                onChange={() => toggleField(field)}
              />
              {field}
            </label>
          ))}
        </div>
      </div>

      {state.selectedFields.length > 0 && (
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Filters (equals, optional)
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {state.selectedFields.map((field) => (
              <input
                key={field}
                placeholder={field}
                value={state.filters[field] ?? ""}
                onChange={(e) => setFilter(field, e.target.value)}
                className="rounded-lg border border-border bg-surface px-2 py-1 text-xs"
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onRun}
          disabled={state.selectedFields.length === 0 || isRunning}
          className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          {isRunning ? "Running…" : "Run Report"}
        </button>
        <button
          onClick={onExport}
          disabled={state.selectedFields.length === 0}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-ink hover:bg-primary-soft disabled:opacity-60"
        >
          Export CSV
        </button>
        <input
          placeholder="Report name to save"
          value={reportName}
          onChange={(e) => setReportName(e.target.value)}
          className="rounded-lg border border-border bg-surface px-2 py-1.5 text-xs"
        />
        <button
          onClick={() => {
            if (reportName.trim()) {
              onSave(reportName.trim());
              setReportName("");
            }
          }}
          disabled={state.selectedFields.length === 0 || !reportName.trim()}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-ink hover:bg-primary-soft disabled:opacity-60"
        >
          Save
        </button>
      </div>
    </div>
  );
}
