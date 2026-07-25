import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { createOrgUnit, listOrgUnits } from "../../lib/api/org-settings";

const UNIT_TYPES = [
  "BusinessUnit",
  "Division",
  "SectionTeam",
  "BranchOffice",
  "Region",
  "Zone",
  "Territory",
  "Campus",
  "Building",
  "Floor",
  "WorkArea",
  "Location",
];

/** Consolidates business unit/division/section-team/branch/region/campus/location into one type-tagged catalog. */
export function OrgUnitSection() {
  const queryClient = useQueryClient();
  const orgUnits = useQuery({ queryKey: ["org-units"], queryFn: listOrgUnits });

  const [unitType, setUnitType] = useState("BusinessUnit");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");

  const createMutation = useMutation({
    mutationFn: () => createOrgUnit({ unitType, code, name, city: city || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["org-units"] });
      setCode("");
      setName("");
      setCity("");
    },
  });

  const errorMessage = createMutation.error instanceof ApiError ? createMutation.error.message : undefined;

  return (
    <Card title="Org Units (Business Unit / Division / Region / Location / …)">
      {errorMessage && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      <form
        className="mb-4 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          createMutation.mutate();
        }}
      >
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Type</span>
          <select value={unitType} onChange={(e) => setUnitType(e.target.value)} className="input w-40">
            {UNIT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Code</span>
          <input required value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} className="input w-32" />
        </label>
        <label className="block flex-1 basis-40">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Name</span>
          <input required value={name} onChange={(e) => setName(e.target.value)} className="input" />
        </label>
        <label className="block flex-1 basis-32">
          <span className="mb-1 block text-xs font-medium text-ink-muted">City (optional)</span>
          <input value={city} onChange={(e) => setCity(e.target.value)} className="input" />
        </label>
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          {createMutation.isPending ? "Adding…" : "Add Unit"}
        </button>
      </form>
      <ul className="flex flex-wrap gap-2">
        {orgUnits.data?.map((u) => (
          <li key={u.id} className="rounded-lg border border-border px-3 py-1.5 text-sm">
            <span className="font-medium">{u.name}</span> <span className="text-ink-faint">({u.unitType})</span>
            {u.city && <span className="ml-1 text-xs text-ink-faint">· {u.city}</span>}
          </li>
        ))}
      </ul>
    </Card>
  );
}
