import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { archiveOrgPolicy, createOrgPolicy, listOrgPolicies } from "../../lib/api/org-settings";

/** Organization policies — no dedicated spec; minimal policy-document registry. */
export function PolicySection() {
  const queryClient = useQueryClient();
  const policies = useQuery({ queryKey: ["org-policies"], queryFn: listOrgPolicies });

  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [effectiveFrom, setEffectiveFrom] = useState("");

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["org-policies"] });

  const createMutation = useMutation({
    mutationFn: () => createOrgPolicy({ category, title, content, effectiveFrom }),
    onSuccess: () => {
      invalidate();
      setCategory("");
      setTitle("");
      setContent("");
      setEffectiveFrom("");
    },
  });

  const archiveMutation = useMutation({ mutationFn: (id: string) => archiveOrgPolicy(id), onSuccess: invalidate });

  const errorMessage = createMutation.error instanceof ApiError ? createMutation.error.message : undefined;

  return (
    <Card title="Organization Policies">
      {errorMessage && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      <form
        className="mb-4 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          createMutation.mutate();
        }}
      >
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Category</span>
          <input required value={category} onChange={(e) => setCategory(e.target.value)} className="input w-32" />
        </label>
        <label className="block flex-1 basis-40">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Title</span>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className="input" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Effective From</span>
          <input
            required
            type="date"
            value={effectiveFrom}
            onChange={(e) => setEffectiveFrom(e.target.value)}
            className="input"
          />
        </label>
        <label className="block basis-full">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Content</span>
          <textarea
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="input min-h-16 w-full"
          />
        </label>
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          {createMutation.isPending ? "Adding…" : "Add Policy"}
        </button>
      </form>
      <ul className="space-y-2">
        {policies.data?.map((p) => (
          <li key={p.id} className="rounded-lg border border-border p-3 text-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">{p.title}</span>{" "}
                <Badge tone={p.status === "Active" ? "positive" : "neutral"}>{p.status}</Badge>
                <p className="mt-1 text-xs text-ink-faint">
                  {p.category} · effective {new Date(p.effectiveFrom).toLocaleDateString("en-IN")}
                </p>
                <p className="mt-1 text-xs text-ink-faint">{p.content}</p>
              </div>
              {p.status === "Active" && (
                <button
                  type="button"
                  onClick={() => archiveMutation.mutate(p.id)}
                  className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover"
                >
                  Archive
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
