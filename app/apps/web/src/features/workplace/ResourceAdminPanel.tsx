import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { activateResource, createResource, deactivateResource, listAllResources } from "../../lib/api/workplace";

const RESOURCE_TYPES = ["Desk", "Room", "Parking", "Shuttle", "Cafeteria"] as const;

/** Admin catalog: desk/room/parking/shuttle/cafeteria resources, each with a per-date capacity. */
export function ResourceAdminPanel() {
  const queryClient = useQueryClient();
  const resources = useQuery({ queryKey: ["workplace-resources-all"], queryFn: listAllResources });

  const [type, setType] = useState<(typeof RESOURCE_TYPES)[number]>("Desk");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("1");

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["workplace-resources-all"] });
    queryClient.invalidateQueries({ queryKey: ["workplace-resources"] });
  };
  const createMutation = useMutation({
    mutationFn: () => createResource({ type, name, location: location || undefined, capacity: Number(capacity) }),
    onSuccess: () => {
      setName("");
      setLocation("");
      setCapacity("1");
      invalidate();
    },
  });
  const deactivateMutation = useMutation({ mutationFn: (id: string) => deactivateResource(id), onSuccess: invalidate });
  const activateMutation = useMutation({ mutationFn: (id: string) => activateResource(id), onSuccess: invalidate });

  return (
    <Card title="Workplace Resource Catalog">
      {createMutation.error instanceof ApiError && (
        <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{createMutation.error.message}</p>
      )}
      <form
        className="mb-4 flex flex-wrap items-end gap-2 border-b border-border pb-4"
        onSubmit={(e) => {
          e.preventDefault();
          createMutation.mutate();
        }}
      >
        <select value={type} onChange={(e) => setType(e.target.value as typeof type)} className="input">
          {RESOURCE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <input required placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="input" />
        <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="input" />
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Capacity</span>
          <input type="number" min="1" value={capacity} onChange={(e) => setCapacity(e.target.value)} className="input w-20" />
        </label>
        <button type="submit" className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-hover">
          Add Resource
        </button>
      </form>

      <ul className="space-y-1">
        {resources.data?.map((r) => (
          <li key={r.id} className="flex items-center justify-between rounded-lg border border-border p-2 text-sm">
            <span>
              {r.type}: {r.name} {r.location && <span className="text-ink-faint">· {r.location}</span>} · capacity {r.capacity}
            </span>
            <div className="flex items-center gap-2">
              <Badge tone={r.isActive ? "positive" : "neutral"}>{r.isActive ? "Active" : "Inactive"}</Badge>
              {r.isActive ? (
                <button
                  type="button"
                  onClick={() => deactivateMutation.mutate(r.id)}
                  className="rounded-lg border border-border px-2 py-1 text-xs font-semibold hover:bg-surface-hover"
                >
                  Deactivate
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => activateMutation.mutate(r.id)}
                  className="rounded-lg border border-border px-2 py-1 text-xs font-semibold hover:bg-surface-hover"
                >
                  Activate
                </button>
              )}
            </div>
          </li>
        ))}
        {resources.data?.length === 0 && <p className="text-sm text-ink-faint">No resources configured yet.</p>}
      </ul>
    </Card>
  );
}
