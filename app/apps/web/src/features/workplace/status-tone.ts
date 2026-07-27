import type { BadgeTone } from "../../components/ui/Badge";

export function visitorStatusTone(status: string): BadgeTone {
  if (status === "CheckedIn" || status === "CheckedOut") return "positive";
  if (status === "Cancelled" || status === "Expired") return "negative";
  if (status === "Approved") return "info";
  return "warning";
}

export function bookingStatusTone(status: string): BadgeTone {
  return status === "Cancelled" ? "negative" : "positive";
}
