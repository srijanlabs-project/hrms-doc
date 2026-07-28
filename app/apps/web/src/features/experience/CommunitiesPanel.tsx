import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { createCommunity, joinCommunity, leaveCommunity, listCommunities } from "../../lib/api/experience";
import { ApiError } from "../../lib/api/http";

/** Self-service: join-based interest groups. Any employee can create one. */
export function CommunitiesPanel() {
  const queryClient = useQueryClient();
  const communities = useQuery({ queryKey: ["communities"], queryFn: listCommunities });
  const [name, setName] = useState("");

  const invalidate = () => void queryClient.invalidateQueries({ queryKey: ["communities"] });
  const create = useMutation({
    mutationFn: () => createCommunity({ name }),
    onSuccess: () => {
      invalidate();
      setName("");
    },
  });
  const join = useMutation({ mutationFn: (id: string) => joinCommunity(id), onSuccess: invalidate });
  const leave = useMutation({ mutationFn: (id: string) => leaveCommunity(id), onSuccess: invalidate });
  const errorMessage = create.error instanceof ApiError ? create.error.message : undefined;

  return (
    <Card title="Communities">
      {errorMessage && <p className="mb-3 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      <form
        className="mb-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          create.mutate();
        }}
      >
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Start a community…"
          className="input flex-1"
        />
        <button
          type="submit"
          disabled={create.isPending}
          className="rounded-lg border border-border px-3 py-2 text-xs font-medium hover:border-primary disabled:opacity-60"
        >
          Create
        </button>
      </form>

      <ul className="grid gap-2 sm:grid-cols-2">
        {communities.data?.map((c) => (
          <li key={c.id} className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-xs text-ink-faint">{c.category}</p>
            </div>
            <button
              type="button"
              disabled={join.isPending || leave.isPending}
              onClick={() => (c.isMember ? leave.mutate(c.id) : join.mutate(c.id))}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium disabled:opacity-60 ${
                c.isMember
                  ? "border border-border hover:border-negative hover:text-negative"
                  : "bg-primary text-white hover:bg-primary-hover"
              }`}
            >
              {c.isMember ? "Leave" : "Join"}
            </button>
          </li>
        ))}
        {communities.data?.length === 0 && <p className="text-ink-muted">No communities yet — start one above.</p>}
      </ul>
    </Card>
  );
}
