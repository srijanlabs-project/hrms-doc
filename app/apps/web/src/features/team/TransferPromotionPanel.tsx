import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { listDepartments } from "../../lib/api/departments";
import { listDesignations, listGrades } from "../../lib/api/org-settings";
import type { TeamRosterMember } from "../../lib/api/team-dashboard";
import {
  applyTransferPromotion,
  approveTransferPromotion,
  type ChangeType,
  listAllTransferPromotionRequests,
  listMyTransferPromotionRequests,
  proposeTransferPromotion,
  rejectTransferPromotion,
  type TransferPromotionRequest,
} from "../../lib/api/transfer-promotion";

const CHANGE_TYPES: ChangeType[] = ["Transfer", "Promotion", "Demotion"];

function statusTone(status: string) {
  if (status === "Applied") return "positive" as const;
  if (status === "Approved") return "info" as const;
  if (status === "Rejected") return "negative" as const;
  return "warning" as const;
}

function RequestRow({ request, isAdmin, onDecide }: { request: TransferPromotionRequest; isAdmin: boolean; onDecide: (action: "approve" | "reject" | "apply", id: string) => void }) {
  return (
    <li className="rounded-lg border border-border p-3 text-sm">
      <div className="flex items-center justify-between gap-2">
        <div>
          <span className="font-medium">{request.changeType}</span> for {request.employee.legalName}
          {request.toDepartment && <> to {request.toDepartment.name}</>}
          {request.toDesignation && <> as {request.toDesignation.title}</>}{" "}
          <Badge tone={statusTone(request.status)}>{request.status}</Badge>
          <p className="mt-1 text-xs text-ink-faint">
            Effective {new Date(request.effectiveDate).toLocaleDateString("en-IN")} · {request.reason}
          </p>
          {request.changeType === "Promotion" && (
            <p className="mt-1 text-xs text-ink-faint">
              Latest appraisal rating:{" "}
              {request.latestAppraisalRating !== null
                ? `${request.latestAppraisalRating}/5 (${request.latestAppraisalPeriodYear})`
                : "No finalized appraisal on record"}
            </p>
          )}
          {request.decisionNote && <p className="mt-1 text-xs text-ink-faint">Note: {request.decisionNote}</p>}
        </div>
        {isAdmin && request.status === "Proposed" && (
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => onDecide("approve", request.id)}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
            >
              Approve
            </button>
            <button
              type="button"
              onClick={() => onDecide("reject", request.id)}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover"
            >
              Reject
            </button>
          </div>
        )}
        {isAdmin && request.status === "Approved" && (
          <button
            type="button"
            onClick={() => onDecide("apply", request.id)}
            className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
          >
            Apply
          </button>
        )}
      </div>
    </li>
  );
}

/** Manager Self Service (E05) gap closure — propose transfers/promotions for direct reports; org_admin/hr_ops decide. */
export function TransferPromotionPanel({ roster, isAdmin }: { roster: TeamRosterMember[]; isAdmin: boolean }) {
  const queryClient = useQueryClient();
  const mine = useQuery({ queryKey: ["transfer-promotion", "mine"], queryFn: listMyTransferPromotionRequests });
  const all = useQuery({ queryKey: ["transfer-promotion", "all"], queryFn: () => listAllTransferPromotionRequests(), enabled: isAdmin });
  const departments = useQuery({ queryKey: ["departments"], queryFn: listDepartments });
  const designations = useQuery({ queryKey: ["designations"], queryFn: listDesignations });
  const grades = useQuery({ queryKey: ["grades"], queryFn: listGrades });

  const [employeeId, setEmployeeId] = useState("");
  const [changeType, setChangeType] = useState<ChangeType>("Transfer");
  const [toDepartmentId, setToDepartmentId] = useState("");
  const [toDesignationId, setToDesignationId] = useState("");
  const [toGradeId, setToGradeId] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [reason, setReason] = useState("");

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["transfer-promotion"] });
    queryClient.invalidateQueries({ queryKey: ["team-dashboard"] });
  };

  const proposeMutation = useMutation({
    mutationFn: () =>
      proposeTransferPromotion({
        employeeId,
        changeType,
        toDepartmentId: toDepartmentId || undefined,
        toDesignationId: toDesignationId || undefined,
        toGradeId: toGradeId || undefined,
        effectiveDate,
        reason,
      }),
    onSuccess: () => {
      invalidate();
      setEmployeeId("");
      setToDepartmentId("");
      setToDesignationId("");
      setToGradeId("");
      setEffectiveDate("");
      setReason("");
    },
  });

  const decide = (action: "approve" | "reject" | "apply", id: string) => {
    if (action === "approve") approveMutation.mutate(id);
    if (action === "apply") applyMutation.mutate(id);
    if (action === "reject") {
      const note = window.prompt("Reason for rejecting this request?");
      if (note) rejectMutation.mutate({ id, note });
    }
  };

  const approveMutation = useMutation({ mutationFn: (id: string) => approveTransferPromotion(id), onSuccess: invalidate });
  const rejectMutation = useMutation({ mutationFn: ({ id, note }: { id: string; note: string }) => rejectTransferPromotion(id, note), onSuccess: invalidate });
  const applyMutation = useMutation({ mutationFn: (id: string) => applyTransferPromotion(id), onSuccess: invalidate });

  const requests = isAdmin ? all.data : mine.data;

  return (
    <Card title="Transfers & Promotions">
      <div className="space-y-4">
        {roster.length > 0 && (
          <form
            className="flex flex-wrap items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              proposeMutation.mutate();
            }}
          >
            <select required value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="input">
              <option value="">Direct report…</option>
              {roster.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.legalName}
                </option>
              ))}
            </select>
            <select value={changeType} onChange={(e) => setChangeType(e.target.value as ChangeType)} className="input">
              {CHANGE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <select value={toDepartmentId} onChange={(e) => setToDepartmentId(e.target.value)} className="input">
              <option value="">New department (optional)</option>
              {departments.data?.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <select value={toDesignationId} onChange={(e) => setToDesignationId(e.target.value)} className="input">
              <option value="">New designation (optional)</option>
              {designations.data?.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title}
                </option>
              ))}
            </select>
            <select value={toGradeId} onChange={(e) => setToGradeId(e.target.value)} className="input">
              <option value="">New grade (optional)</option>
              {grades.data?.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
            <input required type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} className="input" />
            <input required placeholder="Reason" value={reason} onChange={(e) => setReason(e.target.value)} className="input flex-1 basis-40" />
            <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover">
              Propose
            </button>
          </form>
        )}

        <ul className="space-y-2">
          {requests?.map((r) => (
            <RequestRow key={r.id} request={r} isAdmin={isAdmin} onDecide={decide} />
          ))}
          {requests?.length === 0 && <p className="text-sm text-ink-faint">No transfer or promotion requests yet.</p>}
        </ul>
      </div>
    </Card>
  );
}
