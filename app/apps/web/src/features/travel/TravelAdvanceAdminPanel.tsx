import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { approveTravelAdvance, disburseTravelAdvance, listAllTravelAdvancesAdmin, rejectTravelAdvance } from "../../lib/api/travel";

function advanceTone(status: string): "positive" | "warning" | "negative" | "neutral" {
  if (status === "Disbursed") return "positive";
  if (status === "Requested") return "warning";
  if (status === "Rejected") return "negative";
  return "neutral";
}

/** Admin: review and disburse travel advance requests tenant-wide. */
export function TravelAdvanceAdminPanel() {
  const queryClient = useQueryClient();
  const advances = useQuery({ queryKey: ["travel-advances-admin"], queryFn: listAllTravelAdvancesAdmin });
  const invalidate = () => void queryClient.invalidateQueries({ queryKey: ["travel-advances-admin"] });
  const approve = useMutation({ mutationFn: (id: string) => approveTravelAdvance(id), onSuccess: invalidate });
  const reject = useMutation({ mutationFn: (id: string) => rejectTravelAdvance(id), onSuccess: invalidate });
  const disburse = useMutation({ mutationFn: (id: string) => disburseTravelAdvance(id), onSuccess: invalidate });

  return (
    <Card title="Travel Advances (Admin)">
      <ul className="space-y-2">
        {advances.data?.map((a) => (
          <li key={a.id} className="rounded-lg border border-border p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {a.employee.legalName} — ₹{a.requestedAmount.toLocaleString("en-IN")}
              </span>
              <Badge tone={advanceTone(a.status)}>{a.status}</Badge>
            </div>
            {a.status === "Requested" && (
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  disabled={approve.isPending}
                  onClick={() => approve.mutate(a.id)}
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
                >
                  Approve
                </button>
                <button
                  type="button"
                  disabled={reject.isPending}
                  onClick={() => reject.mutate(a.id)}
                  className="rounded-lg border border-border px-3 py-1 text-xs font-medium hover:border-negative hover:text-negative"
                >
                  Reject
                </button>
              </div>
            )}
            {a.status === "Approved" && (
              <button
                type="button"
                disabled={disburse.isPending}
                onClick={() => disburse.mutate(a.id)}
                className="mt-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
              >
                Mark Disbursed
              </button>
            )}
          </li>
        ))}
        {advances.data?.length === 0 && <p className="text-ink-muted">No travel advance requests yet.</p>}
      </ul>
    </Card>
  );
}
