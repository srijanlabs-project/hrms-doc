import { Card } from "../../components/ui/Card";
import { bulkExportUrl, IMPORTABLE_ENTITY_TYPES } from "../../lib/api/implementation";

/**
 * W0·E31 Implementation and Migration — bulk export. Read-side counterpart to
 * the import engine: same entity list, a fixed column set per type (unlike
 * E25's custom-report builder, which lets the user pick columns).
 */
export function BulkExportPanel() {
  return (
    <Card title="Bulk Export">
      <p className="mb-3 text-sm text-ink-muted">Download current data per module as CSV, e.g. for a legacy-system handover.</p>
      <ul className="flex flex-wrap gap-2">
        {IMPORTABLE_ENTITY_TYPES.map((entityType) => (
          <li key={entityType}>
            <a
              href={bulkExportUrl(entityType)}
              className="inline-block rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:bg-surface-muted"
            >
              Export {entityType}
            </a>
          </li>
        ))}
      </ul>
    </Card>
  );
}
