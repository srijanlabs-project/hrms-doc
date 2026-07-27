import { useQuery } from "@tanstack/react-query";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { listActiveEmergencyContacts } from "../../lib/api/health-safety";

/** Read-only for every employee: who to call in an emergency. Admin management lives in EmergencyContactAdminPanel. */
export function EmergencyContactPanel() {
  const contacts = useQuery({ queryKey: ["emergency-contacts-active"], queryFn: listActiveEmergencyContacts });

  return (
    <Card title="Emergency Response Contacts">
      <ul className="space-y-2">
        {contacts.data?.map((c) => (
          <li key={c.id} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
            <span>
              <Badge tone="info">{c.category}</Badge> {c.name} — {c.role}
            </span>
            <span className="font-semibold">{c.phone}</span>
          </li>
        ))}
        {contacts.data?.length === 0 && <p className="text-sm text-ink-faint">No emergency contacts published yet.</p>}
      </ul>
    </Card>
  );
}
