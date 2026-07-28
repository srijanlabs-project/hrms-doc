import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { applyCandidate, createCandidate, listOpenRequisitionsForReferral, listTalentPool } from "../../lib/api/recruitment";
import { useAuth } from "../auth/AuthProvider";

const RECRUITMENT_ADMIN_ROLES = ["org_admin", "hr_ops"];

/**
 * W3·E06 Recruitment and ATS gap closure — talent pool. A candidate with
 * zero applications IS a pool candidate (see CandidateRepository.findPool) —
 * no separate pool entity. Tags/notes make sourced candidates searchable
 * for future openings; nominating one to a requisition just creates the
 * normal Application row, same as the pipeline board's own flow.
 */
export function TalentPoolPage() {
  const { user } = useAuth();
  const isAdmin = RECRUITMENT_ADMIN_ROLES.some((role) => user?.roles.includes(role));
  const queryClient = useQueryClient();

  const pool = useQuery({ queryKey: ["talent-pool"], queryFn: listTalentPool, enabled: isAdmin });
  const openRequisitions = useQuery({
    queryKey: ["open-requisitions-referral"],
    queryFn: listOpenRequisitionsForReferral,
    enabled: isAdmin,
  });

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [notes, setNotes] = useState("");
  const [nominating, setNominating] = useState<string | null>(null);
  const [requisitionId, setRequisitionId] = useState("");

  const createMutation = useMutation({
    mutationFn: () =>
      createCandidate({
        fullName,
        email,
        tags: tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        notes: notes || undefined,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["talent-pool"] });
      setFullName("");
      setEmail("");
      setTagsInput("");
      setNotes("");
    },
  });

  const nominateMutation = useMutation({
    mutationFn: (candidateId: string) => applyCandidate(requisitionId, candidateId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["talent-pool"] });
      setNominating(null);
      setRequisitionId("");
    },
  });

  if (!isAdmin) {
    return (
      <div className="rounded-(--radius-card) border border-border bg-surface p-8 text-center text-ink-muted">
        Talent Pool is restricted to HR Operations and Org Admin roles.
      </div>
    );
  }

  const error = createMutation.error ?? nominateMutation.error;
  const errorMessage = error instanceof ApiError ? error.message : undefined;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Talent Pool</h1>
        <p className="text-ink-muted">Sourced candidates not yet linked to a requisition — tag and hold them for future openings.</p>
      </header>

      <Card title="Add Sourced Candidate">
        {errorMessage && <p className="mb-3 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
        <form
          className="flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate();
          }}
        >
          <input required placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="input" />
          <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
          <input placeholder="Tags (comma-separated)" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className="input flex-1 basis-40" />
          <input placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="input flex-1 basis-40" />
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
          >
            {createMutation.isPending ? "Saving…" : "Add to Pool"}
          </button>
        </form>
      </Card>

      <Card title={`Pool (${pool.data?.length ?? 0})`}>
        <ul className="space-y-2">
          {pool.data?.map((candidate) => (
            <li key={candidate.id} className="rounded-lg border border-border p-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="font-medium">{candidate.fullName}</div>
                  <div className="text-xs text-ink-faint">{candidate.email}</div>
                  {candidate.notes && <p className="mt-1 text-xs text-ink-muted">{candidate.notes}</p>}
                  {candidate.tags.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {candidate.tags.map((tag) => (
                        <Badge key={tag} tone="neutral">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setNominating(nominating === candidate.id ? null : candidate.id)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-primary"
                >
                  Nominate to Requisition
                </button>
              </div>
              {nominating === candidate.id && (
                <form
                  className="mt-3 flex flex-wrap items-end gap-2 rounded-lg border border-dashed border-border p-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    nominateMutation.mutate(candidate.id);
                  }}
                >
                  <select required value={requisitionId} onChange={(e) => setRequisitionId(e.target.value)} className="input w-64">
                    <option value="">Select requisition</option>
                    {openRequisitions.data?.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.title}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    disabled={nominateMutation.isPending || !requisitionId}
                    className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
                  >
                    {nominateMutation.isPending ? "Nominating…" : "Confirm"}
                  </button>
                </form>
              )}
            </li>
          ))}
          {pool.data?.length === 0 && <p className="text-ink-muted">No sourced candidates in the pool yet.</p>}
        </ul>
      </Card>
    </div>
  );
}
