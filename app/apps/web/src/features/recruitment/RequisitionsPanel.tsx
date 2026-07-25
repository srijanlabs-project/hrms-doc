import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { approveRequisition, closeRequisition, createRequisition, listRequisitions, publishRequisition } from "../../lib/api/recruitment";
import { requisitionStatusTone } from "./status-tone";

/** Requisition lifecycle cockpit: Draft -> Approved -> Published -> Closed (docs/08-submodule-specifications/06-recruitment-and-ats/02-requisitions.md, collapsed — see schema.prisma's Requisition comment). */
export function RequisitionsPanel({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const queryClient = useQueryClient();
  const requisitions = useQuery({ queryKey: ["requisitions"], queryFn: listRequisitions });

  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [headcount, setHeadcount] = useState("1");

  const invalidate = () => void queryClient.invalidateQueries({ queryKey: ["requisitions"] });

  const createMutation = useMutation({
    mutationFn: () => createRequisition({ code, title, headcount: Number(headcount) }),
    onSuccess: (requisition) => {
      invalidate();
      onSelect(requisition.id);
      setCode("");
      setTitle("");
      setHeadcount("1");
    },
  });

  const transition = useMutation({
    mutationFn: (input: { id: string; action: "approve" | "publish" | "close" }) => {
      if (input.action === "approve") return approveRequisition(input.id);
      if (input.action === "publish") return publishRequisition(input.id);
      return closeRequisition(input.id);
    },
    onSuccess: invalidate,
  });

  const error = createMutation.error ?? transition.error;
  const errorMessage = error instanceof ApiError ? error.message : undefined;

  const nextAction: Record<string, "approve" | "publish" | "close" | undefined> = {
    Draft: "approve",
    Approved: "publish",
    Published: "close",
  };
  const actionLabel: Record<string, string> = { approve: "Approve", publish: "Publish", close: "Close" };

  return (
    <Card title="Requisitions">
      <form
        className="mb-4 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          createMutation.mutate();
        }}
      >
        {errorMessage && <p className="w-full rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Code</span>
          <input required value={code} onChange={(e) => setCode(e.target.value)} className="input w-28" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Title</span>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className="input w-56" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Headcount</span>
          <input
            required
            type="number"
            min="1"
            value={headcount}
            onChange={(e) => setHeadcount(e.target.value)}
            className="input w-20"
          />
        </label>
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          {createMutation.isPending ? "Creating…" : "New Requisition"}
        </button>
      </form>

      <ul className="space-y-2">
        {requisitions.data?.map((requisition) => {
          const action = nextAction[requisition.status];
          return (
            <li key={requisition.id}>
              <button
                type="button"
                onClick={() => onSelect(requisition.id)}
                className={`flex w-full items-center justify-between rounded-lg border p-3 text-left ${
                  selectedId === requisition.id ? "border-primary bg-primary-soft" : "border-border hover:border-primary"
                }`}
              >
                <div>
                  <div className="font-medium">{requisition.title}</div>
                  <div className="text-xs text-ink-faint">
                    {requisition.code} · {requisition.headcount} opening(s)
                  </div>
                </div>
                <Badge tone={requisitionStatusTone(requisition.status)}>{requisition.status}</Badge>
              </button>
              {action && (
                <button
                  type="button"
                  disabled={transition.isPending}
                  onClick={() => transition.mutate({ id: requisition.id, action })}
                  className="mt-1 w-full rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-primary disabled:opacity-60"
                >
                  {actionLabel[action]}
                </button>
              )}
            </li>
          );
        })}
      </ul>
      {requisitions.data?.length === 0 && <p className="text-ink-muted">No requisitions yet.</p>}
    </Card>
  );
}
