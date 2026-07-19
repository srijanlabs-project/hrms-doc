import type { BadgeTone } from "../../components/ui/Badge";

/** Maps the employee_master state machine (spec section 15) to a Badge tone. */
export function employeeStatusTone(status: string): BadgeTone {
  switch (status) {
    case "Active":
      return "positive";
    case "Suspended":
      return "warning";
    case "Separated":
    case "Archived":
      return "neutral";
    case "Draft":
    case "Pre-Active":
    default:
      return "info";
  }
}
