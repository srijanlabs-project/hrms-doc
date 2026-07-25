import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { createGoal, listMyGoals, listTeamGoals } from "../../lib/api/performance";
import { GoalRow } from "./GoalRow";

/** T-001 "My Goals" made real — docs/08-submodule-specifications/11-performance-management/01-goal-management.md (v1: no cascading, no shared goals, no milestones). */
export function GoalsPage() {
  const queryClient = useQueryClient();
  const goals = useQuery({ queryKey: ["goals-my"], queryFn: listMyGoals });
  const teamGoals = useQuery({ queryKey: ["goals-team"], queryFn: listTeamGoals });

  const now = new Date();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [weight, setWeight] = useState("100");
  const [dueDate, setDueDate] = useState("");

  const createMutation = useMutation({
    mutationFn: () =>
      createGoal({
        periodYear: now.getUTCFullYear(),
        title,
        description: description || undefined,
        weight: Number(weight),
        dueDate: dueDate || undefined,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["goals-my"] });
      setTitle("");
      setDescription("");
      setWeight("100");
      setDueDate("");
    },
  });

  const errorMessage = createMutation.error instanceof ApiError ? createMutation.error.message : undefined;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">My Goals</h1>
        <p className="text-ink-muted">Track your goals for {now.getUTCFullYear()} and update your progress.</p>
      </header>

      <Card title="New Goal">
        <form
          className="flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate();
          }}
        >
          {errorMessage && <p className="w-full rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
          <label className="block flex-1 basis-52">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Title</span>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} className="input" />
          </label>
          <label className="block flex-1 basis-52">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Description</span>
            <input value={description} onChange={(e) => setDescription(e.target.value)} className="input" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Weight %</span>
            <input
              type="number"
              min="1"
              max="100"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="input w-20"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Due Date</span>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="input" />
          </label>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
          >
            {createMutation.isPending ? "Adding…" : "Add Goal"}
          </button>
        </form>
      </Card>

      <Card title="My Goals">
        {goals.isLoading && <p className="text-ink-muted">Loading goals…</p>}
        {goals.data?.length === 0 && <p className="text-ink-muted">No goals yet — add one above.</p>}
        <ul className="space-y-2">{goals.data?.map((goal) => <GoalRow key={goal.id} goal={goal} />)}</ul>
      </Card>

      {(teamGoals.data?.length ?? 0) > 0 && (
        <Card title="Team Goals">
          <ul className="space-y-2">
            {teamGoals.data?.map((goal) => (
              <GoalRow key={goal.id} goal={goal} readOnly />
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
