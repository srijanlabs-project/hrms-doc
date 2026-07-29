import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "../../components/ui/Card";
import { listGoLiveChecklist, setGoLiveChecklistItem, type GoLiveChecklistItem } from "../../lib/api/implementation";

function ChecklistGroup({
  title,
  items,
  onToggle,
}: {
  title: string;
  items: GoLiveChecklistItem[];
  onToggle: (key: string, completed: boolean) => void;
}) {
  const completedCount = items.filter((item) => item.completed).length;
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">
        {title} — {completedCount} of {items.length} complete
      </p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.key} className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={item.completed} onChange={(e) => onToggle(item.key, e.target.checked)} />
            <span className={item.completed ? "text-ink-faint line-through" : ""}>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Curated onboarding/setup tasks — not a full go-live sign-off workflow, no
 * staging environment to hand over between. W5·P gap closure ("cutover")
 * adds a second Cutover-phase group on the same flat checklist via the
 * `phase` field — still governance tracking, not an environment switch.
 */
export function GoLiveChecklistPanel() {
  const queryClient = useQueryClient();
  const items = useQuery({ queryKey: ["go-live-checklist"], queryFn: listGoLiveChecklist });

  const toggleMutation = useMutation({
    mutationFn: ({ key, completed }: { key: string; completed: boolean }) => setGoLiveChecklistItem(key, completed),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["go-live-checklist"] }),
  });

  const onToggle = (key: string, completed: boolean) => toggleMutation.mutate({ key, completed });
  const setupItems = items.data?.filter((item) => item.phase === "Setup") ?? [];
  const cutoverItems = items.data?.filter((item) => item.phase === "Cutover") ?? [];

  return (
    <Card title="Go-Live Checklist">
      <div className="space-y-4">
        <ChecklistGroup title="Setup" items={setupItems} onToggle={onToggle} />
        <ChecklistGroup title="Cutover" items={cutoverItems} onToggle={onToggle} />
      </div>
    </Card>
  );
}
