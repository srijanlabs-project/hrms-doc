import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { deleteSystemSetting, listSystemSettings, upsertSystemSetting } from "../../lib/api/admin";
import { ApiError } from "../../lib/api/http";

/**
 * W0·E28 Administration — flat key/value tenant config store. Stands in for
 * the spec's full dynamic-field/masters framework: no current consumer needs
 * per-tenant custom fields, so this closes the "system settings"/"tenant
 * controls" gap without over-building.
 */
export function SystemSettingsPanel() {
  const queryClient = useQueryClient();
  const settings = useQuery({ queryKey: ["system-settings"], queryFn: listSystemSettings });

  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");

  const invalidate = () => void queryClient.invalidateQueries({ queryKey: ["system-settings"] });

  const upsertMutation = useMutation({
    mutationFn: () => upsertSystemSetting(key, { value, description: description || undefined }),
    onSuccess: () => {
      setKey("");
      setValue("");
      setDescription("");
      invalidate();
    },
  });
  const deleteMutation = useMutation({ mutationFn: (k: string) => deleteSystemSetting(k), onSuccess: invalidate });
  const upsertError = upsertMutation.error instanceof ApiError ? upsertMutation.error.message : undefined;

  return (
    <Card title="System Settings">
      <p className="mb-3 text-sm text-ink-muted">Company-wide configuration values, e.g. default currency, fiscal year start.</p>
      {upsertError && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{upsertError}</p>}
      <form
        className="flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          upsertMutation.mutate();
        }}
      >
        <input required placeholder="Key" value={key} onChange={(e) => setKey(e.target.value)} className="input" />
        <input required placeholder="Value" value={value} onChange={(e) => setValue(e.target.value)} className="input" />
        <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="input flex-1" />
        <button
          type="submit"
          disabled={upsertMutation.isPending}
          className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          Save
        </button>
      </form>
      <ul className="mt-3 space-y-2">
        {settings.data?.map((s) => (
          <li key={s.id} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
            <div>
              <span className="font-mono font-medium">{s.key}</span> = <span>{s.value}</span>
              {s.description && <p className="text-xs text-ink-faint">{s.description}</p>}
            </div>
            <button
              onClick={() => deleteMutation.mutate(s.key)}
              className="rounded-lg border border-border px-2 py-1 text-xs hover:bg-surface-muted"
            >
              Delete
            </button>
          </li>
        ))}
        {settings.data?.length === 0 && <p className="text-sm text-ink-faint">No settings configured yet.</p>}
      </ul>
    </Card>
  );
}
