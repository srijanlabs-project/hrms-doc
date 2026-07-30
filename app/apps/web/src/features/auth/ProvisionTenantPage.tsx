import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { ApiError } from "../../lib/api/http";
import { provisionTenant, type ProvisionTenantResult } from "../../lib/api/provisioning";

/**
 * W0·E28 Administration gap closure — tenant provisioning. Deliberately not
 * linked from any tenant's own nav (an org_admin of one tenant must never
 * be able to spin up another tenant): this is a standalone route reachable
 * only by direct URL, gated by a shared platform key rather than any
 * tenant-scoped session. See ProvisioningController/PlatformKeyGuard.
 */
export function ProvisionTenantPage() {
  const [platformKey, setPlatformKey] = useState("");
  const [tenantCode, setTenantCode] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [result, setResult] = useState<ProvisionTenantResult | null>(null);

  const mutation = useMutation({
    mutationFn: () =>
      provisionTenant(platformKey, {
        tenantCode: tenantCode.trim().toLowerCase(),
        tenantName: tenantName.trim(),
        adminEmail: adminEmail.trim().toLowerCase(),
      }),
    onSuccess: (data) => setResult(data),
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm rounded-(--radius-card) border border-border bg-surface p-8 shadow-(--shadow-raised)">
        <div className="mb-6 flex items-center">
          <img src="/staffsy-logo.png" alt="Staffsy" className="h-7 w-auto" />
        </div>

        <h1 className="mb-1 text-lg font-semibold">Provision a new company</h1>
        <p className="mb-6 text-ink-muted">Platform-ops only. Creates the company plus its first org_admin login.</p>

        {result ? (
          <div className="space-y-3">
            <p className="rounded-lg bg-positive-soft px-3 py-2 text-positive">
              Company "{result.tenant.name}" created.
            </p>
            <p className="text-sm text-ink-muted">
              Workspace code: <span className="font-mono font-semibold text-ink">{result.tenant.code}</span>
              <br />
              Admin login: <span className="font-mono font-semibold text-ink">{result.admin.email}</span>
              <br />
              Sign in at <a href="/login" className="text-primary underline">/login</a> using the verification code
              configured for this environment.
            </p>
            <button
              onClick={() => {
                setResult(null);
                setTenantCode("");
                setTenantName("");
                setAdminEmail("");
              }}
              className="w-full rounded-lg border border-border px-4 py-2 font-semibold text-ink hover:bg-primary-soft"
            >
              Provision another
            </button>
          </div>
        ) : (
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
              <span className="mb-1 block text-xs font-medium text-ink-muted">Platform Key</span>
              <input
                required
                type="password"
                value={platformKey}
                onChange={(e) => setPlatformKey(e.target.value)}
                className="input"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-ink-muted">Workspace Code</span>
              <input
                required
                value={tenantCode}
                onChange={(e) => setTenantCode(e.target.value)}
                placeholder="acme-corp"
                className="input"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-ink-muted">Company Name</span>
              <input
                required
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                placeholder="Acme Corporation"
                className="input"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-ink-muted">First Admin Email</span>
              <input
                required
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="input"
                autoComplete="username"
              />
            </label>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
            >
              {mutation.isPending ? "Provisioning…" : "Create Company"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
