import { useQuery } from "@tanstack/react-query";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { getComplianceOverview } from "../../lib/api/compliance-overview";

/**
 * W0·E29 Security and Governance — compliance monitoring rollup. Reuses
 * three already-real signals (statutory compliance tasks, the open access
 * review cycle, consent revocations) rather than a new alerting/monitoring
 * engine — see ComplianceOverviewService's doc comment.
 */
export function ComplianceOverviewPage() {
  const overview = useQuery({ queryKey: ["compliance-overview"], queryFn: getComplianceOverview });
  const data = overview.data;

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Compliance Overview</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card title="Statutory Compliance Tasks">
          <p className="text-3xl font-bold">{data?.complianceTasks.open ?? "—"}</p>
          <p className="text-xs text-ink-faint">Open</p>
          <p className="mt-2 text-2xl font-semibold text-negative">{data?.complianceTasks.overdue ?? "—"}</p>
          <p className="text-xs text-ink-faint">Overdue</p>
        </Card>

        <Card title="Access Review">
          {data?.accessReview ? (
            <>
              <p className="text-sm font-medium">{data.accessReview.periodLabel}</p>
              <p className="text-3xl font-bold">{data.accessReview.pendingItems}</p>
              <p className="text-xs text-ink-faint">Pending of {data.accessReview.totalItems} items</p>
              <Badge tone="warning">Open Cycle</Badge>
            </>
          ) : (
            <p className="text-sm text-ink-faint">No open access review cycle.</p>
          )}
        </Card>

        <Card title="Consent">
          <p className="text-3xl font-bold">{data?.consent.total ?? "—"}</p>
          <p className="text-xs text-ink-faint">Total records</p>
          <p className="mt-2 text-2xl font-semibold text-negative">{data?.consent.revoked ?? "—"}</p>
          <p className="text-xs text-ink-faint">Revoked</p>
        </Card>
      </div>
    </div>
  );
}
