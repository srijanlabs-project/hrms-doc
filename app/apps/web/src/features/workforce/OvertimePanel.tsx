import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import {
  approveOvertimeRequest,
  createOvertimeRequest,
  listMyOvertimeRequests,
  listTeamOvertimeRequests,
  rejectOvertimeRequest,
} from "../../lib/api/workforce";
import { OvertimeApprovals } from "./OvertimeApprovals";
import { OvertimeRequestList } from "./OvertimeRequestList";

/** 06-overtime.md v1 slice — payableAmount is an estimate, computed on approval only. */
export function OvertimePanel() {
  const queryClient = useQueryClient();
  const mine = useQuery({ queryKey: ["overtime-mine"], queryFn: listMyOvertimeRequests });
  const team = useQuery({ queryKey: ["overtime-team"], queryFn: listTeamOvertimeRequests });

  const [date, setDate] = useState("");
  const [hoursRequested, setHoursRequested] = useState("");
  const [reason, setReason] = useState("");
  const [settlementType, setSettlementType] = useState<"Payable" | "CompOff">("Payable");

  const invalidateMine = () => queryClient.invalidateQueries({ queryKey: ["overtime-mine"] });
  const invalidateTeam = () => queryClient.invalidateQueries({ queryKey: ["overtime-team"] });

  const createMutation = useMutation({
    mutationFn: () =>
      createOvertimeRequest({ date, hoursRequested: Number(hoursRequested), reason: reason || undefined, settlementType }),
    onSuccess: () => {
      invalidateMine();
      setDate("");
      setHoursRequested("");
      setReason("");
      setSettlementType("Payable");
    },
  });
  const approveMutation = useMutation({ mutationFn: (id: string) => approveOvertimeRequest(id), onSuccess: invalidateTeam });
  const rejectMutation = useMutation({ mutationFn: (id: string) => rejectOvertimeRequest(id), onSuccess: invalidateTeam });

  const errorMessage = createMutation.error instanceof ApiError ? createMutation.error.message : undefined;

  return (
    <div className="space-y-4">
      <Card title="Request Overtime">
        {errorMessage && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
        <form
          className="flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate();
          }}
        >
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Date</span>
            <input required type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Hours</span>
            <input
              required
              type="number"
              min="0.5"
              max="16"
              step="0.5"
              value={hoursRequested}
              onChange={(e) => setHoursRequested(e.target.value)}
              className="input w-24"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Settlement</span>
            <select value={settlementType} onChange={(e) => setSettlementType(e.target.value as "Payable" | "CompOff")} className="input">
              <option value="Payable">Payable</option>
              <option value="CompOff">Comp Off</option>
            </select>
          </label>
          <label className="block flex-1 basis-52">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Reason</span>
            <input value={reason} onChange={(e) => setReason(e.target.value)} className="input" />
          </label>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
          >
            {createMutation.isPending ? "Submitting…" : "Submit"}
          </button>
        </form>
      </Card>

      <OvertimeRequestList requests={mine.data} />

      {(team.data?.length ?? 0) > 0 && (
        <OvertimeApprovals requests={team.data ?? []} onApprove={approveMutation.mutate} onReject={rejectMutation.mutate} />
      )}
    </div>
  );
}
