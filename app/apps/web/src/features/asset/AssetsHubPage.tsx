import { useQuery } from "@tanstack/react-query";
import { Card } from "../../components/ui/Card";
import { useAuth } from "../auth/AuthProvider";
import { listAssets, listMyAssetAssignments } from "../../lib/api/assets";
import { AssetAuditPanel } from "./AssetAuditPanel";
import { AssetCatalogAndAssignments } from "./AssetCatalogAndAssignments";
import { AssignmentRow } from "./AssignmentRow";
import { MaintenancePanel } from "./MaintenancePanel";
import { MyLicensesPanel } from "./MyLicensesPanel";
import { SoftwareLicensePanel } from "./SoftwareLicensePanel";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/** T-005 Smart Form -> Asset Assignment/Return, v1 slice. See schema.prisma's Asset/AssetAssignment comments for what's deferred. */
export function AssetsHubPage() {
  const { user } = useAuth();
  const isAdmin = ADMIN_ROLES.some((role) => user?.roles.includes(role));

  const myAssignments = useQuery({ queryKey: ["asset-assignments-my"], queryFn: listMyAssetAssignments });
  const assets = useQuery({ queryKey: ["assets"], queryFn: listAssets, enabled: isAdmin });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Assets</h1>
        <p className="text-ink-muted">Track company assets assigned to you and, for admins, the full catalog.</p>
      </header>

      <Card title="My Assets">
        {myAssignments.data?.length === 0 && <p className="text-ink-muted">No assets currently assigned to you.</p>}
        <ul className="space-y-2">
          {myAssignments.data?.map((assignment) => (
            <AssignmentRow key={assignment.id} assignment={assignment} />
          ))}
        </ul>
      </Card>

      <MyLicensesPanel />

      {isAdmin && (
        <>
          <AssetCatalogAndAssignments />
          <MaintenancePanel assets={assets.data ?? []} />
          <AssetAuditPanel />
          <SoftwareLicensePanel />
        </>
      )}
    </div>
  );
}
