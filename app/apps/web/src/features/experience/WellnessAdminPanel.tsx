import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { createWellnessProgram } from "../../lib/api/experience";
import { ApiError } from "../../lib/api/http";
import type { WellnessProgram } from "../../lib/api/types";

const CATEGORIES: WellnessProgram["category"][] = ["Fitness", "MentalHealth", "Nutrition", "Other"];

/** Admin: create wellness programs for employees to enroll in. */
export function WellnessAdminPanel() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<WellnessProgram["category"]>("Fitness");
  const [startDate, setStartDate] = useState("");

  const create = useMutation({
    mutationFn: () => createWellnessProgram({ title, category, startDate }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["wellness-programs"] });
      setTitle("");
      setStartDate("");
    },
  });
  const errorMessage = create.error instanceof ApiError ? create.error.message : undefined;

  return (
    <Card title="Wellness Programs (Admin)">
      {errorMessage && <p className="mb-3 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      <form
        className="flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          create.mutate();
        }}
      >
        <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Program title" className="input flex-1" />
        <select value={category} onChange={(e) => setCategory(e.target.value as typeof category)} className="input">
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input required type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input" />
        <button
          type="submit"
          disabled={create.isPending}
          className="rounded-lg border border-border px-3 py-2 text-xs font-medium hover:border-primary disabled:opacity-60"
        >
          Create
        </button>
      </form>
    </Card>
  );
}
