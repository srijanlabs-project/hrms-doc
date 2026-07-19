import type { BadgeTone } from "../../components/ui/Badge";

/** Maps the leave-request state machine (spec 03-leave-approval.md section 15, simplified) to a Badge tone. */
export function leaveStatusTone(status: string): BadgeTone {
  switch (status) {
    case "Approved":
      return "positive";
    case "Rejected":
      return "negative";
    case "Cancelled":
      return "neutral";
    case "Pending":
    default:
      return "warning";
  }
}
