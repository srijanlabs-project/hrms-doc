import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import type { AccessReviewItem } from "../../lib/api/security";

const DECISION_TONE: Record<AccessReviewItem["decision"], "positive" | "negative" | "neutral"> = {
  Confirmed: "positive",
  Revoked: "negative",
  Pending: "neutral",
};

/** One user's role snapshot for a cycle — extracted from AccessReviewCycleDetail to keep it under the line limit. */
export function AccessReviewItemRow({
  item,
  onConfirm,
  onRevoke,
}: {
  item: AccessReviewItem;
  onConfirm: () => void;
  onRevoke: (notes: string) => void;
}) {
  const [notes, setNotes] = useState("");

  return (
    <li className="rounded-lg border border-border p-3 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium">{item.user.email}</span>
        <Badge tone={DECISION_TONE[item.decision]}>{item.decision}</Badge>
      </div>
      <p className="mt-1 text-xs text-ink-faint">Roles at review: {item.rolesSnapshot.join(", ") || "none"}</p>
      {item.decision === "Pending" && (
        <div className="mt-2 flex flex-wrap items-end gap-2">
          <input
            placeholder="Notes (required to revoke)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="input flex-1"
          />
          <button
            onClick={onConfirm}
            className="rounded-lg border border-border px-2 py-1 text-xs font-semibold hover:bg-surface-muted"
          >
            Confirm
          </button>
          <button
            onClick={() => onRevoke(notes)}
            className="rounded-lg bg-negative px-2 py-1 text-xs font-semibold text-white hover:opacity-90"
          >
            Revoke Access
          </button>
        </div>
      )}
      {item.notes && <p className="mt-1 text-xs text-ink-faint">Note: {item.notes}</p>}
    </li>
  );
}
