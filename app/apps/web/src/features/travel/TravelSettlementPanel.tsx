import { useQuery } from "@tanstack/react-query";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { getTravelSettlement } from "../../lib/api/travel";

const DIRECTION_LABEL = {
  EmployeeOwesCompany: "You owe the company",
  CompanyOwesEmployee: "Company owes you",
  Settled: "Settled",
} as const;

/** Self-service: always computed live from linked advances and expense claims — never stored. */
export function TravelSettlementPanel({ travelRequestId }: { travelRequestId: string }) {
  const settlement = useQuery({
    queryKey: ["travel-settlement", travelRequestId],
    queryFn: () => getTravelSettlement(travelRequestId),
  });

  if (!settlement.data) return null;

  return (
    <Card title="Settlement">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs text-ink-muted">Advance Received</p>
          <p className="text-lg font-semibold">₹{settlement.data.totalAdvance.toLocaleString("en-IN")}</p>
        </div>
        <div>
          <p className="text-xs text-ink-muted">Expenses Claimed</p>
          <p className="text-lg font-semibold">₹{settlement.data.totalExpenses.toLocaleString("en-IN")}</p>
        </div>
        <div>
          <p className="text-xs text-ink-muted">Net</p>
          <p className="text-lg font-semibold">₹{settlement.data.netAmount.toLocaleString("en-IN")}</p>
        </div>
      </div>
      <div className="mt-3 text-center">
        <Badge tone={settlement.data.netDirection === "Settled" ? "positive" : "warning"}>
          {DIRECTION_LABEL[settlement.data.netDirection]}
        </Badge>
      </div>
    </Card>
  );
}
