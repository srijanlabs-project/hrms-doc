import type { BadgeTone } from "../../components/ui/Badge";

export function requisitionStatusTone(status: string): BadgeTone {
  switch (status) {
    case "Published":
      return "positive";
    case "Approved":
      return "info";
    case "Closed":
    case "Cancelled":
      return "neutral";
    case "OnHold":
      return "warning";
    case "Draft":
    default:
      return "warning";
  }
}

export function applicationStageTone(stage: string): BadgeTone {
  switch (stage) {
    case "Hired":
      return "positive";
    case "Rejected":
      return "negative";
    case "Offer":
      return "info";
    case "Applied":
    case "Screening":
    case "Interview":
    default:
      return "warning";
  }
}

export function offerStatusTone(status: string): BadgeTone {
  switch (status) {
    case "Converted":
    case "Accepted":
      return "positive";
    case "Declined":
      return "negative";
    case "Issued":
      return "info";
    default:
      return "warning";
  }
}
