import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { listEmployees } from "../../lib/api/employees";
import { ApiError } from "../../lib/api/http";
import {
  confirmMfaEnrollment,
  createDelegation,
  enrollMfa,
  listMfaFactors,
  listMyDelegations,
  listSessions,
  revokeDelegation,
  revokeMfaFactor,
  revokeSession,
} from "../../lib/api/security";
import { useAuth } from "../auth/AuthProvider";

const DELEGATION_SCOPES = [
  "LeaveApproval",
  "ExpenseApproval",
  "TravelApproval",
  "TimesheetApproval",
  "OvertimeApproval",
  "All",
];

/** Identity and Access deepening (03-identity-and-access) v1 slice: MFA (TOTP), device/session management, delegation. SSO stays deferred — no real identity provider in this environment. */
export function SecurityPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const factors = useQuery({ queryKey: ["mfa-factors"], queryFn: listMfaFactors });
  const sessions = useQuery({ queryKey: ["sessions"], queryFn: listSessions });
  const delegations = useQuery({ queryKey: ["delegations-mine"], queryFn: listMyDelegations });
  const employees = useQuery({ queryKey: ["employees"], queryFn: listEmployees });

  const [enrollment, setEnrollment] = useState<{ secret: string; otpauthUri: string } | null>(null);
  const [confirmCode, setConfirmCode] = useState("");

  const [delegateUserId, setDelegateUserId] = useState("");
  const [scope, setScope] = useState("LeaveApproval");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const enrollMutation = useMutation({
    mutationFn: enrollMfa,
    onSuccess: (result) => setEnrollment(result),
  });

  const confirmMutation = useMutation({
    mutationFn: () => confirmMfaEnrollment(confirmCode),
    onSuccess: () => {
      setEnrollment(null);
      setConfirmCode("");
      queryClient.invalidateQueries({ queryKey: ["mfa-factors"] });
    },
  });

  const revokeFactorMutation = useMutation({
    mutationFn: (id: string) => revokeMfaFactor(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["mfa-factors"] }),
  });

  const revokeSessionMutation = useMutation({
    mutationFn: (id: string) => revokeSession(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sessions"] }),
  });

  const createDelegationMutation = useMutation({
    mutationFn: () => createDelegation({ delegateUserId, scope, startDate, endDate }),
    onSuccess: () => {
      setDelegateUserId("");
      setStartDate("");
      setEndDate("");
      queryClient.invalidateQueries({ queryKey: ["delegations-mine"] });
    },
  });

  const revokeDelegationMutation = useMutation({
    mutationFn: (id: string) => revokeDelegation(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["delegations-mine"] }),
  });

  const activeFactor = factors.data?.find((f) => f.status === "Active");

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Security</h1>

      <Card title="Multi-Factor Authentication">
        {enrollMutation.error instanceof ApiError && (
          <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{enrollMutation.error.message}</p>
        )}
        {confirmMutation.error instanceof ApiError && (
          <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{confirmMutation.error.message}</p>
        )}

        {activeFactor ? (
          <div className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
            <span>
              Authenticator app <Badge tone="positive">Active</Badge>
            </span>
            <button
              type="button"
              onClick={() => revokeFactorMutation.mutate(activeFactor.id)}
              className="text-xs text-negative hover:underline"
            >
              Revoke
            </button>
          </div>
        ) : enrollment ? (
          <div className="space-y-3">
            <p className="text-sm text-ink-muted">
              Scan this into your authenticator app (Google Authenticator, Authy, etc.), or enter the secret manually:
            </p>
            <code className="block rounded-lg bg-canvas px-3 py-2 text-xs break-all">{enrollment.otpauthUri}</code>
            <p className="text-xs text-ink-faint">
              Secret: <span className="font-mono">{enrollment.secret}</span>
            </p>
            <form
              className="flex items-end gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                confirmMutation.mutate();
              }}
            >
              <input
                required
                value={confirmCode}
                onChange={(e) => setConfirmCode(e.target.value)}
                placeholder="6-digit code"
                inputMode="numeric"
                className="input w-40"
              />
              <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover">
                Confirm
              </button>
            </form>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => enrollMutation.mutate()}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover"
          >
            Enroll Authenticator App
          </button>
        )}
      </Card>

      <Card title="Active Sessions">
        <ul className="space-y-1">
          {sessions.data?.map((s) => (
            <li key={s.id} className="flex items-center justify-between rounded-lg border border-border p-2 text-sm">
              <span>
                Signed in {new Date(s.issuedAt).toLocaleString("en-IN")}
                {s.isCurrent && <Badge tone="info">This device</Badge>}
              </span>
              {!s.isCurrent && (
                <button type="button" onClick={() => revokeSessionMutation.mutate(s.id)} className="text-xs text-negative hover:underline">
                  Revoke
                </button>
              )}
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Delegate My Approvals">
        <form
          className="mb-3 flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            createDelegationMutation.mutate();
          }}
        >
          <select value={delegateUserId} onChange={(e) => setDelegateUserId(e.target.value)} className="input">
            <option value="">Delegate to…</option>
            {employees.data
              ?.filter((emp) => emp.id !== user?.employeeId)
              .map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.legalName}
                </option>
              ))}
          </select>
          <select value={scope} onChange={(e) => setScope(e.target.value)} className="input w-40">
            {DELEGATION_SCOPES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input required type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input" />
          <input required type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input" />
          <button
            type="submit"
            disabled={!delegateUserId}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            Delegate
          </button>
        </form>
        {createDelegationMutation.error instanceof ApiError && (
          <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{createDelegationMutation.error.message}</p>
        )}

        <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-faint">Given</h3>
        <ul className="mb-3 space-y-1">
          {delegations.data?.given.map((d) => (
            <li key={d.id} className="flex items-center justify-between rounded-lg border border-border p-2 text-sm">
              <span>
                {d.scope} to {d.delegate?.email} · {new Date(d.startDate).toLocaleDateString("en-IN")}–
                {new Date(d.endDate).toLocaleDateString("en-IN")} <Badge tone={d.status === "Active" ? "positive" : "neutral"}>{d.status}</Badge>
              </span>
              {d.status === "Active" && (
                <button type="button" onClick={() => revokeDelegationMutation.mutate(d.id)} className="text-xs text-negative hover:underline">
                  Revoke
                </button>
              )}
            </li>
          ))}
          {delegations.data?.given.length === 0 && <p className="text-xs text-ink-faint">No delegations given.</p>}
        </ul>

        <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-faint">Received</h3>
        <ul className="space-y-1">
          {delegations.data?.received.map((d) => (
            <li key={d.id} className="rounded-lg border border-border p-2 text-sm">
              {d.scope} from {d.delegator?.email} · {new Date(d.startDate).toLocaleDateString("en-IN")}–
              {new Date(d.endDate).toLocaleDateString("en-IN")} <Badge tone={d.status === "Active" ? "positive" : "neutral"}>{d.status}</Badge>
            </li>
          ))}
          {delegations.data?.received.length === 0 && <p className="text-xs text-ink-faint">No delegations received.</p>}
        </ul>
      </Card>
    </div>
  );
}
