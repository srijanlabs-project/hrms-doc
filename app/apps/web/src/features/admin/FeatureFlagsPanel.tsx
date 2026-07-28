import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { createFeatureFlag, deleteFeatureFlag, listFeatureFlags, setFeatureFlagEnabled } from "../../lib/api/admin";
import { ApiError } from "../../lib/api/http";

/**
 * W0·E30 DevOps and Operations — feature toggles. A real on/off switch store
 * with a stable key any future service can call FeatureFlagService.isEnabled()
 * against — no rollout-percentage/A-B-test framework, since nothing in this
 * codebase needs staged rollout yet.
 */
export function FeatureFlagsPanel() {
  const queryClient = useQueryClient();
  const flags = useQuery({ queryKey: ["feature-flags"], queryFn: listFeatureFlags });

  const [key, setKey] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const invalidate = () => void queryClient.invalidateQueries({ queryKey: ["feature-flags"] });

  const createMutation = useMutation({
    mutationFn: () => createFeatureFlag({ key, name, description: description || undefined }),
    onSuccess: () => {
      setKey("");
      setName("");
      setDescription("");
      invalidate();
    },
  });
  const toggleMutation = useMutation({
    mutationFn: (input: { key: string; enabled: boolean }) => setFeatureFlagEnabled(input.key, input.enabled),
    onSuccess: invalidate,
  });
  const deleteMutation = useMutation({ mutationFn: (k: string) => deleteFeatureFlag(k), onSuccess: invalidate });
  const createError = createMutation.error instanceof ApiError ? createMutation.error.message : undefined;

  return (
    <Card title="Feature Toggles">
      <p className="mb-3 text-sm text-ink-muted">On/off switches for tenant-wide behavior, gated by a stable key.</p>
      {createError && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{createError}</p>}
      <form
        className="flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          createMutation.mutate();
        }}
      >
        <input required placeholder="key (e.g. new-onboarding-flow)" value={key} onChange={(e) => setKey(e.target.value)} className="input" />
        <input required placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="input" />
        <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="input flex-1" />
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          Add
        </button>
      </form>
      <ul className="mt-3 space-y-2">
        {flags.data?.map((flag) => (
          <li key={flag.id} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
            <div>
              <span className="font-mono font-medium">{flag.key}</span> — {flag.name}
              {flag.description && <p className="text-xs text-ink-faint">{flag.description}</p>}
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={flag.enabled}
                  onChange={(e) => toggleMutation.mutate({ key: flag.key, enabled: e.target.checked })}
                />
                {flag.enabled ? "On" : "Off"}
              </label>
              <button
                onClick={() => deleteMutation.mutate(flag.key)}
                className="rounded-lg border border-border px-2 py-1 text-xs hover:bg-surface-muted"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
        {flags.data?.length === 0 && <p className="text-sm text-ink-faint">No feature flags configured yet.</p>}
      </ul>
    </Card>
  );
}
