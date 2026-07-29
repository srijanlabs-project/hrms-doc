import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { revealMedicalField, upsertPersonalDetail } from "../../lib/api/people-extras";
import type { MedicalField, PersonalDetail } from "../../lib/api/types";

const FIELD_LABELS: Record<MedicalField, string> = {
  allergies: "Allergies",
  medicalConditions: "Medical Conditions",
  physicianName: "Physician Name",
  physicianPhone: "Physician Phone",
};

/** W5·P gap closure ("medical information"). Masked-by-default fields on PersonalDetail — reveal fetches the real value on demand and logs an audit event server-side. */
export function MedicalInfoSection({ employeeId, detail }: { employeeId: string; detail: PersonalDetail | null }) {
  const queryClient = useQueryClient();
  const [revealed, setRevealed] = useState<Partial<Record<MedicalField, string>>>({});
  const [allergies, setAllergies] = useState("");
  const [medicalConditions, setMedicalConditions] = useState("");
  const [physicianName, setPhysicianName] = useState("");
  const [physicianPhone, setPhysicianPhone] = useState("");

  const saveMutation = useMutation({
    mutationFn: () =>
      upsertPersonalDetail(employeeId, {
        allergies: allergies || undefined,
        medicalConditions: medicalConditions || undefined,
        physicianName: physicianName || undefined,
        physicianPhone: physicianPhone || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personal-detail", employeeId] });
      setRevealed({});
    },
  });

  const revealMutation = useMutation({
    mutationFn: (field: MedicalField) => revealMedicalField(employeeId, field),
    onSuccess: (result) => setRevealed((prev) => ({ ...prev, [result.field]: result.value ?? "" })),
  });

  function displayValue(field: MedicalField): string {
    if (!detail?.[field]) return "Not set";
    return revealed[field] ?? detail[field]!;
  }

  return (
    <div className="border-t border-border pt-3">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">Medical Information</h3>
      <ul className="mb-3 space-y-1">
        {(Object.keys(FIELD_LABELS) as MedicalField[]).map((field) => (
          <li key={field} className="flex items-center justify-between rounded-lg border border-border p-2 text-sm">
            <span>
              <span className="font-medium">{FIELD_LABELS[field]}:</span> {displayValue(field)}
            </span>
            {detail?.[field] && revealed[field] === undefined && (
              <button
                type="button"
                onClick={() => revealMutation.mutate(field)}
                className="text-xs text-primary hover:underline"
              >
                Reveal
              </button>
            )}
          </li>
        ))}
      </ul>
      <form
        className="flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          saveMutation.mutate();
        }}
      >
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Allergies</span>
          <input value={allergies} onChange={(e) => setAllergies(e.target.value)} className="input w-40" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Medical Conditions</span>
          <input value={medicalConditions} onChange={(e) => setMedicalConditions(e.target.value)} className="input w-40" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Physician Name</span>
          <input value={physicianName} onChange={(e) => setPhysicianName(e.target.value)} className="input w-32" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Physician Phone</span>
          <input value={physicianPhone} onChange={(e) => setPhysicianPhone(e.target.value)} className="input w-32" />
        </label>
        <button
          type="submit"
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover"
        >
          {saveMutation.isPending ? "Saving…" : "Save Medical Info"}
        </button>
      </form>
    </div>
  );
}
