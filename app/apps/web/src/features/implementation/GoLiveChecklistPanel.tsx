import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "../../components/ui/Card";
import { listGoLiveChecklist, setGoLiveChecklistItem } from "../../lib/api/implementation";

/** Curated onboarding/setup tasks — not a full go-live sign-off workflow, no staging environment to hand over between. */
export function GoLiveChecklistPanel() {
  const queryClient = useQueryClient();
  const items = useQuery({ queryKey: ["go-live-checklist"], queryFn: listGoLiveChecklist });

  const toggleMutation = useMutation({
    mutationFn: ({ key, completed }: { key: string; completed: boolean }) => setGoLiveChecklistItem(key, completed),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["go-live-checklist"] }),
  });

  const completedCount = items.data?.filter((item) => item.completed).length ?? 0;

  return (
    <Card title="Go-Live Checklist">
      <p className="mb-3 text-xs text-ink-faint">
        {completedCount} of {items.data?.length ?? 0} setup tasks complete.
      </p>
      <ul className="space-y-2">
        {items.data?.map((item) => (
          <li key={item.key} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={item.completed}
              onChange={(e) => toggleMutation.mutate({ key: item.key, completed: e.target.checked })}
            />
            <span className={item.completed ? "text-ink-faint line-through" : ""}>{item.label}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
