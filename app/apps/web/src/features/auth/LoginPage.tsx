import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestOtp, verifyOtp } from "../../lib/api/auth";
import { ApiError } from "../../lib/api/http";
import { useAuth } from "./AuthProvider";

/**
 * No template board exists for a login screen anywhere in the 179-screen
 * registry (checked 14-screen-mockup-master-registry.md and
 * 21-screen-template-assignment-matrix.md — the mockup library starts
 * post-authentication). Built from the shared Staffsy design tokens instead
 * of inventing a board reference.
 *
 * OTP-only login (no password): request a code, then verify it. In dev the
 * code is always a fixed constant (AuthService.requestOtp) — the response's
 * `devOtp` is shown directly in the UI so the flow is testable without a
 * real email/SMS gateway. That gateway is a pre-UAT swap-in
 * (apps/api/src/auth/otp/otp-provider.ts); this screen doesn't change when
 * it lands, only the dev banner disappears (`devOtp` stops being sent).
 */
export function LoginPage() {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [step, setStep] = useState<"request" | "verify">("request");
  const [tenantCode, setTenantCode] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);

  const requestMutation = useMutation({
    mutationFn: () => requestOtp({ tenantCode: tenantCode.trim().toLowerCase(), email }),
    onSuccess: (result) => {
      setDevOtp(result.devOtp ?? null);
      setOtp(result.devOtp ?? "");
      setStep("verify");
    },
  });

  const verifyMutation = useMutation({
    mutationFn: () => verifyOtp({ tenantCode: tenantCode.trim().toLowerCase(), email, otp }),
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

        {step === "request" ? (
          <>
            <h1 className="mb-1 text-lg font-semibold">Sign in to your workspace</h1>
            <p className="mb-6 text-ink-muted">We'll email you a one-time verification code.</p>

            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                requestMutation.mutate();
              }}
            >
              {requestMutation.error instanceof ApiError && (
                <p className="rounded-lg bg-negative-soft px-3 py-2 text-negative">
                  {requestMutation.error.message}
                </p>
              )}

              <label className="block">
                <span className="mb-1 block text-xs font-medium text-ink-muted">Workspace Code</span>
                <input
                  required
                  value={tenantCode}
                  onChange={(e) => setTenantCode(e.target.value)}
                  placeholder="srijanlabs"
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

              <button
                type="submit"
                disabled={requestMutation.isPending}
                className="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
              >
                {requestMutation.isPending ? "Sending…" : "Send Code"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="mb-1 text-lg font-semibold">Enter verification code</h1>
            <p className="mb-4 text-ink-muted">
              Code sent to <span className="font-medium text-ink">{email}</span>.
            </p>

            {devOtp && (
              <p className="mb-4 rounded-lg bg-warning-soft px-3 py-2 text-warning">
                Dev mode — no real code was sent. Your code is <strong>{devOtp}</strong>.
              </p>
            )}

            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                verifyMutation.mutate();
              }}
            >
              {verifyMutation.error instanceof ApiError && (
                <p className="rounded-lg bg-negative-soft px-3 py-2 text-negative">
                  {verifyMutation.error.message}
                </p>
              )}

              <label className="block">
                <span className="mb-1 block text-xs font-medium text-ink-muted">Verification Code</span>
                <input
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  inputMode="numeric"
                  className="input text-center text-lg tracking-[0.3em]"
                  autoComplete="one-time-code"
                  autoFocus
                />
              </label>

              <button
                type="submit"
                disabled={verifyMutation.isPending}
                className="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
              >
                {verifyMutation.isPending ? "Verifying…" : "Verify & Sign In"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("request");
                  setOtp("");
                  setDevOtp(null);
                }}
                className="w-full text-center text-ink-muted hover:text-primary"
              >
                Use a different email
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
