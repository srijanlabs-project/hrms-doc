import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { proxyLoginByEmployee } from "../../lib/api/security";
import { useAuth } from "../auth/AuthProvider";

/** Identity and Access deepening (proxy login) — admin support tool. Ends the admin's own session; they sign back in as themselves afterward. */
export function ProxyLoginCard({ employeeId, employeeName }: { employeeId: string; employeeName: string }) {
  const { refresh } = useAuth();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: () => proxyLoginByEmployee(employeeId),
    onSuccess: () => {
      refresh();
      navigate("/home", { replace: true });
    },
  });

  return (
    <Card title="Proxy Login">
      {mutation.error instanceof ApiError && (
        <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-sm text-negative">{mutation.error.message}</p>
      )}
      <p className="mb-2 text-sm text-ink-muted">Sign in as {employeeName} for support purposes. Ends your own session.</p>
      <button
        type="button"
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
        className="w-full rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:bg-surface-hover disabled:opacity-50"
      >
        {mutation.isPending ? "Signing in…" : `Log In As ${employeeName}`}
      </button>
    </Card>
  );
}
