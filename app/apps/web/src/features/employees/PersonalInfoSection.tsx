import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { getPersonalDetail, upsertPersonalDetail } from "../../lib/api/people-extras";
import { EmergencyContactsSection } from "./EmergencyContactsSection";
import { MedicalInfoSection } from "./MedicalInfoSection";

/** v1 slice of docs/.../02-personal-information.md — direct self-service edit, no approval workflow. */
export function PersonalInfoSection({ employeeId }: { employeeId: string }) {
  const queryClient = useQueryClient();
  const bundle = useQuery({ queryKey: ["personal-detail", employeeId], queryFn: () => getPersonalDetail(employeeId) });

  const [maritalStatus, setMaritalStatus] = useState("");
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [nationality, setNationality] = useState("");
  const [currentCity, setCurrentCity] = useState("");

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

      <EmergencyContactsSection employeeId={employeeId} contacts={bundle.data?.emergencyContacts ?? []} />
      <MedicalInfoSection employeeId={employeeId} detail={detail ?? null} />
    </Card>
  );
}
