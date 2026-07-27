import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { IMPORTABLE_ENTITY_TYPES, runImportBatch } from "../../lib/api/implementation";
import type { ImportableEntityType, ImportRowResult, RunImportBatchResult } from "../../lib/api/implementation";

const PLACEHOLDER: Record<ImportableEntityType, string> = {
  Employee: '[{"legalName": "Jane Doe", "joiningDate": "2026-01-15"}]',
  Department: '[{"code": "ENG", "name": "Engineering"}]',
  LegalEntity: '[{"code": "SL-01", "name": "Srijan Labs Pvt Ltd"}]',
  LeavePolicy: '[{"leaveType": "Annual", "name": "Annual Leave", "annualDays": 18}]',
};

/** One module's field shape, expressed as a JSON array of row objects — deliberately not CSV, since fields differ per entity and a column-mapping UI stays deferred. */
export function DataImportPanel({ onCommitted }: { onCommitted: () => void }) {
  const queryClient = useQueryClient();
  const [entityType, setEntityType] = useState<ImportableEntityType>("Employee");
  const [rowsText, setRowsText] = useState("");
  const [results, setResults] = useState<ImportRowResult[] | null>(null);
  const [parseError, setParseError] = useState<string | undefined>();

  const parseRows = (): Record<string, unknown>[] | null => {
    try {
      const parsed = JSON.parse(rowsText);
      if (!Array.isArray(parsed)) throw new Error("Input must be a JSON array of row objects.");
      setParseError(undefined);
      return parsed;
    } catch (err) {
      setParseError(err instanceof Error ? err.message : "Invalid JSON.");
      return null;
    }
  };

  const runMutation = useMutation({
    mutationFn: ({ dryRun }: { dryRun: boolean }) => {
      const rows = parseRows();
      if (!rows) throw new Error("PARSE_FAILED");
      return runImportBatch(entityType, rows, dryRun);
    },
    onSuccess: (result: RunImportBatchResult) => {
      if (result.dryRun) {
        setResults(result.results);
      } else {
        setResults(result.batch.rows?.map((r) => ({ index: r.rowIndex, success: r.success, error: r.errorMessage ?? undefined })) ?? null);
        void queryClient.invalidateQueries({ queryKey: ["import-batches"] });
        onCommitted();
      }
    },
  });
  const runError = runMutation.error instanceof ApiError ? runMutation.error.message : undefined;

  return (
    <Card title="Data Import">
      <p className="mb-3 text-sm text-ink-muted">
        Paste a JSON array of rows for the selected module, matching that module's fields, then validate before committing.
      </p>
      <div className="mb-2 flex items-center gap-2">
        <select
          value={entityType}
          onChange={(e) => setEntityType(e.target.value as ImportableEntityType)}
          className="input w-40"
        >
          {IMPORTABLE_ENTITY_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <textarea
        value={rowsText}
        onChange={(e) => setRowsText(e.target.value)}
        placeholder={PLACEHOLDER[entityType]}
        rows={6}
        className="input w-full font-mono text-xs"
      />
      {parseError && <p className="mt-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{parseError}</p>}
      {runError && <p className="mt-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{runError}</p>}
      <div className="mt-2 flex gap-2">
        <button
          onClick={() => runMutation.mutate({ dryRun: true })}
          disabled={runMutation.isPending}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-muted disabled:opacity-60"
        >
          Validate (Dry Run)
        </button>
        <button
          onClick={() => runMutation.mutate({ dryRun: false })}
          disabled={runMutation.isPending}
          className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          Import
        </button>
      </div>
      {results && (
        <ul className="mt-3 space-y-1 text-xs">
          {results.map((row) => (
            <li key={row.index} className={row.success ? "text-positive" : "text-negative"}>
              Row {row.index + 1}: {row.success ? "OK" : row.error}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
