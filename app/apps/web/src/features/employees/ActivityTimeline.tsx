import { useQuery } from "@tanstack/react-query";
import { Card } from "../../components/ui/Card";
import { getTimeline } from "../../lib/api/people-extras";

export function ActivityTimeline({ employeeId }: { employeeId: string }) {
  const timeline = useQuery({ queryKey: ["timeline", employeeId], queryFn: () => getTimeline(employeeId) });

  return (
    <Card title="Activity Timeline">
      {timeline.data && timeline.data.length > 0 ? (
        <ul className="space-y-2">
          {timeline.data.map((event, i) => (
            <li key={i} className="flex gap-3 rounded-lg border border-border p-3 text-sm">
              <span className="w-24 shrink-0 text-xs text-ink-faint">{new Date(event.date).toLocaleDateString("en-IN")}</span>
              <div>
                <span className="font-medium">{event.title}</span>
                {event.detail && <p className="mt-0.5 text-xs text-ink-faint">{event.detail}</p>}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-ink-muted">No timeline events yet.</p>
      )}
    </Card>
  );
}
