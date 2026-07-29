import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { listAllLicenseAssignments, listAllLicenses, revokeLicenseAssignment } from "../../lib/api/software-license";
import { AssignLicenseForm } from "./AssignLicenseForm";
import { NewLicenseForm } from "./NewLicenseForm";

/** Wave 4·E18 gap closure ("software licenses"). Admin-only — mirrors the Asset Catalog/Assign Asset cards above. */
export function SoftwareLicensePanel() {
  const queryClient = useQueryClient();
  const licenses = useQuery({ queryKey: ["licenses-all"], queryFn: listAllLicenses });
  const assignments = useQuery({ queryKey: ["license-assignments-all"], queryFn: listAllLicenseAssignments });

  const revokeMutation = useMutation({
    mutationFn: (id: string) => revokeLicenseAssignment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["licenses-all"] });
      queryClient.invalidateQueries({ queryKey: ["licenses-active"] });
      queryClient.invalidateQueries({ queryKey: ["license-assignments-all"] });
    },
  });

  return (
    <>
      <Card title="Software Licenses">
        <NewLicenseForm />
        <ul className="space-y-2">
          {licenses.data?.map((license) => (
            <li key={license.id} className="flex items-center justify-between rounded-lg border border-border p-3">
              <span>
                <span className="font-medium">{license.name}</span>
                {license.vendor && <span className="text-xs text-ink-faint"> · {license.vendor}</span>}
                <p className="mt-1 text-xs text-ink-faint">
                  {license.seatsUsed}/{license.totalSeats} seats used
                  {license.expiryDate && ` · Expires ${new Date(license.expiryDate).toLocaleDateString("en-IN")}`}
                </p>
              </span>
              <Badge tone={license.status === "Active" ? "positive" : "negative"}>{license.status}</Badge>
            </li>
          ))}
          {licenses.data?.length === 0 && <p className="text-ink-muted">No software licenses yet.</p>}
        </ul>
      </Card>

      <Card title="Assign License Seat">
        <AssignLicenseForm />
      </Card>

      <Card title="All License Assignments">
        <ul className="space-y-2">
          {assignments.data?.map((a) => (
            <li key={a.id} className="flex items-center justify-between rounded-lg border border-border p-3">
              <span>
                <span className="font-medium">
                  {a.employee.legalName} — {a.license.name}
                </span>
                <p className="mt-1 text-xs text-ink-faint">Assigned {new Date(a.assignedAt).toLocaleDateString("en-IN")}</p>
              </span>
              <div className="flex shrink-0 items-center gap-2">
                <Badge tone={a.status === "Active" ? "positive" : "neutral"}>{a.status}</Badge>
                {a.status === "Active" && (
                  <button
                    type="button"
                    onClick={() => revokeMutation.mutate(a.id)}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover"
                  >
                    Revoke
                  </button>
                )}
              </div>
            </li>
          ))}
          {assignments.data?.length === 0 && <p className="text-ink-muted">No license assignments yet.</p>}
        </ul>
      </Card>
    </>
  );
}
