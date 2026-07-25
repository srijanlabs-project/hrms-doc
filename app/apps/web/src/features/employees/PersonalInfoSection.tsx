import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import {
  addEmergencyContact,
  getPersonalDetail,
  removeEmergencyContact,
  upsertPersonalDetail,
} from "../../lib/api/people-extras";

/** v1 slice of docs/.../02-personal-information.md — direct self-service edit, no approval workflow. */
export function PersonalInfoSection({ employeeId }: { employeeId: string }) {
  const queryClient = useQueryClient();
  const bundle = useQuery({ queryKey: ["personal-detail", employeeId], queryFn: () => getPersonalDetail(employeeId) });

  const [maritalStatus, setMaritalStatus] = useState("");
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [nationality, setNationality] = useState("");
  const [currentCity, setCurrentCity] = useState("");

  const [contactName, setContactName] = useState("");
  const [contactRelationship, setContactRelationship] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["personal-detail", employeeId] });

  const saveMutation = useMutation({
    mutationFn: () =>
      upsertPersonalDetail(employeeId, {
        maritalStatus: maritalStatus || undefined,
        gender: gender || undefined,
        bloodGroup: bloodGroup || undefined,
        nationality: nationality || undefined,
        currentCity: currentCity || undefined,
      }),
    onSuccess: invalidate,
  });

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

  const detail = bundle.data?.personalDetail;

  return (
    <Card title="Personal Information">
      <form
        className="mb-4 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          saveMutation.mutate();
        }}
      >
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Marital Status</span>
          <input
            defaultValue={detail?.maritalStatus ?? ""}
            onChange={(e) => setMaritalStatus(e.target.value)}
            className="input w-32"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Gender</span>
          <input defaultValue={detail?.gender ?? ""} onChange={(e) => setGender(e.target.value)} className="input w-28" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Blood Group</span>
          <input
            defaultValue={detail?.bloodGroup ?? ""}
            onChange={(e) => setBloodGroup(e.target.value)}
            className="input w-24"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Nationality</span>
          <input
            defaultValue={detail?.nationality ?? ""}
            onChange={(e) => setNationality(e.target.value)}
            className="input w-32"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">City</span>
          <input
            defaultValue={detail?.currentCity ?? ""}
            onChange={(e) => setCurrentCity(e.target.value)}
            className="input w-32"
          />
        </label>
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          {saveMutation.isPending ? "Saving…" : "Save"}
        </button>
      </form>

      <div className="border-t border-border pt-3">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">Emergency Contacts</h3>
        <ul className="mb-3 space-y-1">
          {bundle.data?.emergencyContacts.map((c) => (
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
          {bundle.data?.emergencyContacts.length === 0 && (
            <p className="text-xs text-ink-faint">No emergency contacts added.</p>
          )}
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
    </Card>
  );
}
