import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import {
  createReportDefinition,
  deleteReportDefinition,
  listReportDefinitions,
  listReportFields,
  reportExportUrl,
  runAdHocReport,
  runSavedReport,
  type ReportDefinition,
} from "../../lib/api/analytics";
import { useAuth } from "../auth/AuthProvider";
import { ReportBuilderPanel, type BuilderState } from "./ReportBuilderPanel";
import { ReportResultsTable } from "./ReportResultsTable";
import { SavedReportsPanel } from "./SavedReportsPanel";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

function toNumericFilters(filters: Record<string, string>): Record<string, string | number | boolean> {
  const result: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(filters)) {
    if (value === "true" || value === "false") {
      result[key] = value === "true";
    } else if (value !== "" && !Number.isNaN(Number(value))) {
      result[key] = Number(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

/**
 * W5·E25 Analytics and BI — configurable custom-report builder. Read-side
 * analog of the Implementation & Migration import engine: a field-allowlist
 * registry per entity type instead of one hardcoded report per module.
 */
export function CustomReportBuilderPage() {
  const { user } = useAuth();
  const isAdmin = ADMIN_ROLES.some((role) => user?.roles.includes(role));
  const queryClient = useQueryClient();

  const [builder, setBuilder] = useState<BuilderState>({ entityType: "Employee", selectedFields: [], filters: {} });
  const [results, setResults] = useState<{ fields: string[]; rows: Record<string, unknown>[] }>({
    fields: [],
    rows: [],
  });

  const fieldSets = useQuery({ queryKey: ["report-fields"], queryFn: listReportFields, enabled: isAdmin });
  const definitions = useQuery({ queryKey: ["report-definitions"], queryFn: listReportDefinitions, enabled: isAdmin });

  const runMutation = useMutation({
    mutationFn: () => runAdHocReport({ entityType: builder.entityType, selectedFields: builder.selectedFields, filters: toNumericFilters(builder.filters) }),
    onSuccess: (rows) => setResults({ fields: builder.selectedFields, rows }),
  });

  const saveMutation = useMutation({
    mutationFn: (name: string) =>
      createReportDefinition({
        name,
        entityType: builder.entityType,
        selectedFields: builder.selectedFields,
        filters: toNumericFilters(builder.filters),
      }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["report-definitions"] }),
  });

  const runSavedMutation = useMutation({
    mutationFn: (definition: ReportDefinition) => runSavedReport(definition.id),
    onSuccess: ({ definition, rows }) => {
      setBuilder({
        entityType: definition.entityType,
        selectedFields: definition.selectedFields,
        filters: Object.fromEntries(Object.entries(definition.filters ?? {}).map(([k, v]) => [k, String(v)])),
      });
      setResults({ fields: definition.selectedFields, rows });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReportDefinition,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["report-definitions"] }),
  });

  if (!isAdmin) {
    return (
      <div className="rounded-(--radius-card) border border-border bg-surface p-8 text-center text-ink-muted">
        Custom Reports is restricted to HR Operations and Org Admin roles.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Custom Reports</h1>
        <p className="text-ink-muted">Build, save, and export ad-hoc reports across Employee, Leave, and Payroll data.</p>
      </header>

      <Card title="Report Builder">
        <ReportBuilderPanel
          entitySets={fieldSets.data ?? []}
          state={builder}
          onChange={setBuilder}
          onRun={() => runMutation.mutate()}
          onSave={(name) => saveMutation.mutate(name)}
          onExport={() =>
            window.open(
              reportExportUrl({ entityType: builder.entityType, selectedFields: builder.selectedFields, filters: toNumericFilters(builder.filters) }),
              "_blank",
            )
          }
          isRunning={runMutation.isPending}
        />
      </Card>

      <Card title="Results">
        <ReportResultsTable fields={results.fields} rows={results.rows} />
      </Card>

      <Card title="Saved Reports">
        <SavedReportsPanel
          definitions={definitions.data ?? []}
          onRun={(definition) => runSavedMutation.mutate(definition)}
          onDelete={(id) => deleteMutation.mutate(id)}
        />
      </Card>
    </div>
  );
}
