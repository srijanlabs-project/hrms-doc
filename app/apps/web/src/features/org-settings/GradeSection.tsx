import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { createGrade, listGrades } from "../../lib/api/org-settings";

export function GradeSection() {
  const queryClient = useQueryClient();
  const grades = useQuery({ queryKey: ["grades"], queryFn: listGrades });

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [band, setBand] = useState("");
  const [minCompensation, setMinCompensation] = useState("");
  const [maxCompensation, setMaxCompensation] = useState("");

  const createMutation = useMutation({
    mutationFn: () =>
      createGrade({
        code,
        name,
        band: band || undefined,
        minCompensation: minCompensation ? Number(minCompensation) : undefined,
        maxCompensation: maxCompensation ? Number(maxCompensation) : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grades"] });
      setCode("");
      setName("");
      setBand("");
      setMinCompensation("");
      setMaxCompensation("");
    },
  });

  const errorMessage = createMutation.error instanceof ApiError ? createMutation.error.message : undefined;

  return (
    <Card title="Grades & Bands">
      {errorMessage && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      <form
        className="mb-4 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          createMutation.mutate();
        }}
      >
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Code</span>
          <input required value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} className="input w-24" />
        </label>
        <label className="block flex-1 basis-32">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Name</span>
          <input required value={name} onChange={(e) => setName(e.target.value)} className="input" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Band</span>
          <input value={band} onChange={(e) => setBand(e.target.value)} className="input w-28" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Min (₹)</span>
          <input
            type="number"
            value={minCompensation}
            onChange={(e) => setMinCompensation(e.target.value)}
            className="input w-28"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Max (₹)</span>
          <input
            type="number"
            value={maxCompensation}
            onChange={(e) => setMaxCompensation(e.target.value)}
            className="input w-28"
          />
        </label>
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          {createMutation.isPending ? "Adding…" : "Add Grade"}
        </button>
      </form>
      <ul className="flex flex-wrap gap-2">
        {grades.data?.map((g) => (
          <li key={g.id} className="rounded-lg border border-border px-3 py-1.5 text-sm">
            <span className="font-medium">{g.name}</span>
            {g.band && <span className="text-ink-faint"> · {g.band}</span>}
            {g.minCompensation != null && g.maxCompensation != null && (
              <span className="ml-1 text-xs text-ink-faint">
                (₹{g.minCompensation.toLocaleString("en-IN")}–₹{g.maxCompensation.toLocaleString("en-IN")})
              </span>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}
