import type { BadgeTone } from "../../components/ui/Badge";

export function attendanceStatusTone(status: string): BadgeTone {
  switch (status) {
    case "Present":
      return "positive";
    case "HalfDay":
      return "warning";
    case "Absent":
      return "negative";
    case "Not Marked":
    default:
      return "neutral";
  }
}
