import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../lib/api/auth";
import { ApiError } from "../../lib/api/http";
import { useAuth } from "./AuthProvider";

/**
 * No template board exists for a login screen anywhere in the 179-screen
 * registry (checked 14-screen-mockup-master-registry.md and
 * 21-screen-template-assignment-matrix.md — the mockup library starts
 * post-authentication). Built from the shared Staffsy design tokens instead
 * of inventing a board reference.
 */
export function LoginPage() {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [tenantCode, setTenantCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation({
    mutationFn: () => login({ tenantCode: tenantCode.trim().toLowerCase(), email, password }),
    onSuccess: () => {
      refresh();
      navigate("/home", { replace: true });
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm rounded-(--radius-card) border border-border bg-surface p-8 shadow-(--shadow-raised)">
        <div className="mb-6 flex items-center gap-2 text-xl font-bold text-primary">
          <span aria-hidden className="inline-block h-7 w-7 rounded bg-primary" />
          Staffsy
        </div>

        <h1 className="mb-1 text-lg font-semibold">Sign in to your workspace</h1>
        <p className="mb-6 text-ink-muted">Enter your workspace code and credentials.</p>

        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          {mutation.error instanceof ApiError && (
            <p className="rounded-lg bg-negative-soft px-3 py-2 text-negative">{mutation.error.message}</p>
          )}

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Workspace Code</span>
            <input
              required
              value={tenantCode}
              onChange={(e) => setTenantCode(e.target.value)}
              placeholder="acme"
              className="input"
              autoComplete="organization"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Email</span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              autoComplete="username"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Password</span>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              autoComplete="current-password"
            />
          </label>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
          >
            {mutation.isPending ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
