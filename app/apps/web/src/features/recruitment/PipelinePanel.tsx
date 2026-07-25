import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { applyCandidate, createCandidate, listApplications, listCandidates } from "../../lib/api/recruitment";
import { ApplicationRow } from "./ApplicationRow";

/** Pipeline for one requisition — folds screening/interview-scheduling/interview-feedback into a single `stage` field (see Application's schema.prisma comment). */
export function PipelinePanel({ requisitionId }: { requisitionId: string }) {
  const queryClient = useQueryClient();
  const applications = useQuery({
    queryKey: ["applications", requisitionId],
    queryFn: () => listApplications(requisitionId),
  });
  const candidates = useQuery({ queryKey: ["candidates"], queryFn: listCandidates });

  const [candidateId, setCandidateId] = useState("");
  const [showNewCandidate, setShowNewCandidate] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const applyMutation = useMutation({
    mutationFn: () => applyCandidate(requisitionId, candidateId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["applications", requisitionId] });
      setCandidateId("");
    },
  });

  const createCandidateMutation = useMutation({
    mutationFn: () => createCandidate({ fullName, email }),
    onSuccess: (candidate) => {
      void queryClient.invalidateQueries({ queryKey: ["candidates"] });
      setCandidateId(candidate.id);
      setShowNewCandidate(false);
      setFullName("");
      setEmail("");
    },
  });

  const error = applyMutation.error ?? createCandidateMutation.error;
  const errorMessage = error instanceof ApiError ? error.message : undefined;

  return (
    <Card title="Candidate Pipeline">
      {errorMessage && <p className="mb-3 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}

      <form
        className="mb-4 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          applyMutation.mutate();
        }}
      >
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Candidate</span>
          <select required value={candidateId} onChange={(e) => setCandidateId(e.target.value)} className="input w-56">
            <option value="">Select candidate</option>
            {candidates.data?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.fullName} ({c.email})
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          disabled={applyMutation.isPending || !candidateId}
          className="rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          {applyMutation.isPending ? "Adding…" : "Add to Pipeline"}
        </button>
        <button
          type="button"
          onClick={() => setShowNewCandidate((v) => !v)}
          className="rounded-lg border border-border px-3 py-2 text-xs font-medium hover:border-primary"
        >
          + New Candidate
        </button>
      </form>

      {showNewCandidate && (
        <form
          className="mb-4 flex flex-wrap items-end gap-2 rounded-lg border border-dashed border-border p-3"
          onSubmit={(e) => {
            e.preventDefault();
            createCandidateMutation.mutate();
          }}
        >
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Full Name</span>
            <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className="input" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Email</span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
          </label>
          <button
            type="submit"
            disabled={createCandidateMutation.isPending}
            className="rounded-lg border border-border px-3 py-2 text-xs font-medium hover:border-primary disabled:opacity-60"
          >
            {createCandidateMutation.isPending ? "Saving…" : "Save Candidate"}
          </button>
        </form>
      )}

      <ul className="space-y-2">
        {applications.data?.map((application) => (
          <ApplicationRow key={application.id} application={application} />
        ))}
      </ul>
      {applications.data?.length === 0 && (
        <p className="text-ink-muted">No candidates in the pipeline for this requisition yet.</p>
      )}
    </Card>
  );
}
