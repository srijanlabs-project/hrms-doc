import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { activateEmergencyContact, createEmergencyContact, deactivateEmergencyContact, listAllEmergencyContacts } from "../../lib/api/health-safety";

/** org_admin/hr_ops: manage the emergency-response directory (add, deactivate, reactivate). */
export function EmergencyContactAdminPanel() {
  const queryClient = useQueryClient();
  const contacts = useQuery({ queryKey: ["emergency-contacts-all"], queryFn: listAllEmergencyContacts });

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState<"Fire" | "Medical" | "Security" | "Facilities" | "Other">("Other");

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["emergency-contacts-all"] });
    queryClient.invalidateQueries({ queryKey: ["emergency-contacts-active"] });
  };
  const createMutation = useMutation({
    mutationFn: () => createEmergencyContact({ name, role, phone, category }),
    onSuccess: () => {
      setName("");
      setRole("");
      setPhone("");
      invalidate();
    },
  });
  const deactivateMutation = useMutation({ mutationFn: (id: string) => deactivateEmergencyContact(id), onSuccess: invalidate });
  const activateMutation = useMutation({ mutationFn: (id: string) => activateEmergencyContact(id), onSuccess: invalidate });

  return (
    <Card title="Manage Emergency Contacts">
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
        <input required placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="input" />
        <input required placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} className="input" />
        <input required placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="input" />
        <select value={category} onChange={(e) => setCategory(e.target.value as typeof category)} className="input">
          <option value="Fire">Fire</option>
          <option value="Medical">Medical</option>
          <option value="Security">Security</option>
          <option value="Facilities">Facilities</option>
          <option value="Other">Other</option>
        </select>
        <button type="submit" className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-hover">
          Add Contact
        </button>
      </form>

      <ul className="space-y-2">
        {contacts.data?.map((c) => (
          <li key={c.id} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
            <span>
              <Badge tone="info">{c.category}</Badge> {c.name} — {c.role} — {c.phone}{" "}
              {!c.isActive && <Badge tone="negative">Inactive</Badge>}
            </span>
            {c.isActive ? (
              <button
                type="button"
                onClick={() => deactivateMutation.mutate(c.id)}
                className="rounded-lg border border-border px-2 py-1 text-xs font-semibold hover:bg-surface-hover"
              >
                Deactivate
              </button>
            ) : (
              <button
                type="button"
                onClick={() => activateMutation.mutate(c.id)}
                className="rounded-lg border border-border px-2 py-1 text-xs font-semibold hover:bg-surface-hover"
              >
                Reactivate
              </button>
            )}
          </li>
        ))}
        {contacts.data?.length === 0 && <p className="text-sm text-ink-faint">No emergency contacts yet.</p>}
      </ul>
    </Card>
  );
}
