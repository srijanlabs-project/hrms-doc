import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { createCompany, listCompanies } from "../../lib/api/org-settings";

export function CompanySection() {
  const queryClient = useQueryClient();
  const companies = useQuery({ queryKey: ["companies"], queryFn: listCompanies });

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [parentCompanyId, setParentCompanyId] = useState("");
  const [tagline, setTagline] = useState("");

  const createMutation = useMutation({
    mutationFn: () =>
      createCompany({ code, name, parentCompanyId: parentCompanyId || undefined, tagline: tagline || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      setCode("");
      setName("");
      setParentCompanyId("");
      setTagline("");
    },
  });

  const errorMessage = createMutation.error instanceof ApiError ? createMutation.error.message : undefined;

  return (
    <Card title="Companies">
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
          <input required value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} className="input w-32" />
        </label>
        <label className="block flex-1 basis-40">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Name</span>
          <input required value={name} onChange={(e) => setName(e.target.value)} className="input" />
        </label>
        <label className="block flex-1 basis-40">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Parent Company (holding co.)</span>
          <select value={parentCompanyId} onChange={(e) => setParentCompanyId(e.target.value)} className="input">
            <option value="">None</option>
            {companies.data?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block flex-1 basis-40">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Tagline</span>
          <input value={tagline} onChange={(e) => setTagline(e.target.value)} className="input" />
        </label>
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          {createMutation.isPending ? "Adding…" : "Add Company"}
        </button>
      </form>
      <ul className="space-y-1">
        {companies.data?.map((c) => (
          <li key={c.id} className="rounded-lg border border-border p-2 text-sm">
            <span className="font-medium">{c.name}</span> <span className="text-ink-faint">({c.code})</span>
            {c.parentCompanyId && (
              <span className="ml-2 text-xs text-ink-faint">
                subsidiary of {companies.data?.find((p) => p.id === c.parentCompanyId)?.name ?? "—"}
              </span>
            )}
            {c.tagline && <p className="mt-0.5 text-xs text-ink-faint">{c.tagline}</p>}
          </li>
        ))}
      </ul>
    </Card>
  );
}
