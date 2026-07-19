import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { createLeaveRequest, listLeaveBalances, listLeavePolicies } from "../../lib/api/leave";
import { ApiError } from "../../lib/api/http";

/**
 * T-005 Smart Form Workspace -> "Apply for Leave". Board shows a 3-step
 * stepper (Leave Details / Additional Details / Review & Confirm) plus an
 * AI-assistant and holiday-calendar right rail; this is a single-step form
 * with a real balance-summary rail (no fake holidays/AI insight — those
 * need a holiday-calendar module and Ridz wiring that don't exist yet).
 */
export function ApplyLeaveForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const policies = useQuery({ queryKey: ["leave-policies"], queryFn: listLeavePolicies });
  const balances = useQuery({ queryKey: ["leave-balances"], queryFn: listLeaveBalances });

  const mutation = useMutation({
    mutationFn: () => createLeaveRequest({ leaveType, startDate, endDate, reason: reason || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leave-requests-my"] });
      queryClient.invalidateQueries({ queryKey: ["leave-balances"] });
      navigate("/leave", { replace: true });
    },
  });

  const fieldError = (field: string) =>
    mutation.error instanceof ApiError
      ? mutation.error.payload.fieldErrors?.find((f) => f.field === field)?.message
      : undefined;
  const generalError =
    mutation.error instanceof ApiError && !mutation.error.payload.fieldErrors?.length
      ? mutation.error.message
      : undefined;

  return (
    <div className="flex items-start gap-4">
      <Card title="Apply for Leave">
        <form
          className="w-full max-w-lg space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          {generalError && <p className="rounded-lg bg-negative-soft px-3 py-2 text-negative">{generalError}</p>}

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Leave Type</span>
            <select required value={leaveType} onChange={(e) => setLeaveType(e.target.value)} className="input">
              <option value="">Select leave type</option>
              {policies.data?.map((p) => (
                <option key={p.id} value={p.leaveType}>
                  {p.name}
                </option>
              ))}
            </select>
            {fieldError("leaveType") && <span className="mt-1 block text-xs text-negative">{fieldError("leaveType")}</span>}
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-ink-muted">Start Date</span>
              <input
                required
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-ink-muted">End Date</span>
              <input
                required
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input"
              />
              {fieldError("endDate") && <span className="mt-1 block text-xs text-negative">{fieldError("endDate")}</span>}
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Reason for Leave</span>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="input resize-none"
            />
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => navigate("/leave")}
              className="rounded-lg border border-border px-4 py-2 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
            >
              {mutation.isPending ? "Submitting…" : "Submit Request"}
            </button>
          </div>
        </form>
      </Card>

      <Card title="Leave Balance Summary">
        <ul className="w-64 space-y-3">
          {balances.data?.map((b) => (
            <li key={b.leaveType}>
              <div className="mb-1 flex justify-between text-xs">
                <span className="font-medium">{b.name}</span>
                <span className="text-ink-faint">
                  {b.available} / {b.prorated} days
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-canvas">
                <div
                  className="h-1.5 rounded-full bg-primary"
                  style={{ width: `${b.prorated > 0 ? Math.min(100, (b.available / b.prorated) * 100) : 0}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
