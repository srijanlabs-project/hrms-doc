import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { KpiCard } from "../../components/ui/KpiCard";
import { listLeaveBalances, listMyLeaveRequests } from "../../lib/api/leave";
import { LeaveRequestsTable } from "./LeaveRequestsTable";

/** Landing page for the "Leave" nav item: balances + apply action + my requests. */
export function LeaveHubPage() {
  const balances = useQuery({ queryKey: ["leave-balances"], queryFn: listLeaveBalances });
  const requests = useQuery({ queryKey: ["leave-requests-my"], queryFn: listMyLeaveRequests });

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Leave</h1>
          <p className="text-ink-muted">Track your balance and manage leave requests.</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/leave/calendar"
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 font-medium hover:border-primary"
          >
            <CalendarDays className="h-4 w-4" /> Calendar
          </Link>
          <Link
            to="/leave/apply"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover"
          >
            <Plus className="h-4 w-4" /> Apply Leave
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-4">
        {balances.data?.map((b) => (
          <KpiCard key={b.leaveType} label={b.name} value={String(b.available)} caption={`of ${b.prorated} days available`} />
        ))}
      </div>

      <Card title="My Requests">
        {requests.isLoading && <p className="text-ink-muted">Loading requests…</p>}
        {requests.data && <LeaveRequestsTable requests={requests.data} />}
      </Card>
    </div>
  );
}
