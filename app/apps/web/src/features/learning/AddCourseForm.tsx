import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { createCourse } from "../../lib/api/learning";

export function AddCourseForm() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [durationHours, setDurationHours] = useState("1");
  const [isMandatory, setIsMandatory] = useState(false);
  const [recurrenceMonths, setRecurrenceMonths] = useState("");

  const createMutation = useMutation({
    mutationFn: () =>
      createCourse({
        title,
        description: description || undefined,
        durationHours: Number(durationHours),
        isMandatory,
        recurrenceMonths: isMandatory && recurrenceMonths ? Number(recurrenceMonths) : undefined,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["learning-courses-admin"] });
      void queryClient.invalidateQueries({ queryKey: ["learning-catalog"] });
      setTitle("");
      setDescription("");
      setDurationHours("1");
      setIsMandatory(false);
      setRecurrenceMonths("");
    },
  });
  const createError = createMutation.error instanceof ApiError ? createMutation.error.message : undefined;

  return (
    <Card title="Add a Course">
      {createError && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{createError}</p>}
      <form
        className="flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          createMutation.mutate();
        }}
      >
        <label className="block flex-1 basis-52">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Title</span>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className="input" />
        </label>
        <label className="block flex-1 basis-52">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Description</span>
          <input value={description} onChange={(e) => setDescription(e.target.value)} className="input" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Duration (hrs)</span>
          <input
            type="number"
            min="1"
            value={durationHours}
            onChange={(e) => setDurationHours(e.target.value)}
            className="input w-24"
          />
        </label>
        <label className="flex items-center gap-2 pb-2">
          <input type="checkbox" checked={isMandatory} onChange={(e) => setIsMandatory(e.target.checked)} />
          <span className="text-xs font-medium text-ink-muted">Mandatory</span>
        </label>
        {isMandatory && (
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Recurs Every (months)</span>
            <input
              type="number"
              min="1"
              value={recurrenceMonths}
              onChange={(e) => setRecurrenceMonths(e.target.value)}
              placeholder="One-time"
              className="input w-32"
            />
          </label>
        )}
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          {createMutation.isPending ? "Adding…" : "Add Course"}
        </button>
      </form>
    </Card>
  );
}
