import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { addEmergencyContact, removeEmergencyContact } from "../../lib/api/people-extras";
import type { EmergencyContact } from "../../lib/api/types";

export function EmergencyContactsSection({ employeeId, contacts }: { employeeId: string; contacts: EmergencyContact[] }) {
  const queryClient = useQueryClient();
  const [contactName, setContactName] = useState("");
  const [contactRelationship, setContactRelationship] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["personal-detail", employeeId] });

  const addContactMutation = useMutation({
    mutationFn: () => addEmergencyContact(employeeId, { name: contactName, relationship: contactRelationship, phone: contactPhone }),
    onSuccess: () => {
      invalidate();
      setContactName("");
      setContactRelationship("");
      setContactPhone("");
    },
  });

  const removeContactMutation = useMutation({
    mutationFn: (id: string) => removeEmergencyContact(employeeId, id),
    onSuccess: invalidate,
  });

  return (
    <div className="border-t border-border pt-3">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">Emergency Contacts</h3>
      <ul className="mb-3 space-y-1">
        {contacts.map((c) => (
          <li key={c.id} className="flex items-center justify-between rounded-lg border border-border p-2 text-sm">
            <span>
              <span className="font-medium">{c.name}</span> · {c.relationship} · {c.phone}
            </span>
            <button
              type="button"
              onClick={() => removeContactMutation.mutate(c.id)}
              className="text-xs text-negative hover:underline"
            >
              Remove
            </button>
          </li>
        ))}
        {contacts.length === 0 && <p className="text-xs text-ink-faint">No emergency contacts added.</p>}
      </ul>
      <form
        className="flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          addContactMutation.mutate();
        }}
      >
        <input required placeholder="Name" value={contactName} onChange={(e) => setContactName(e.target.value)} className="input w-32" />
        <input
          required
          placeholder="Relationship"
          value={contactRelationship}
          onChange={(e) => setContactRelationship(e.target.value)}
          className="input w-32"
        />
        <input required placeholder="Phone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="input w-32" />
        <button type="submit" className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover">
          Add Contact
        </button>
      </form>
    </div>
  );
}
