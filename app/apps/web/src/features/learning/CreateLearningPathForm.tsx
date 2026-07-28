import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  createLearningPath,
  listAllCourses,
  listAllLearningPaths,
  publishLearningPath,
} from "../../lib/api/learning";

/** Admin-only: compose an ordered path from published/archived courses, then publish it. */
export function CreateLearningPathForm() {
  const queryClient = useQueryClient();
  const allCourses = useQuery({ queryKey: ["learning-courses-admin"], queryFn: listAllCourses });
  const allPaths = useQuery({ queryKey: ["learning-paths-admin"], queryFn: listAllLearningPaths });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["learning-paths-catalog"] });
    void queryClient.invalidateQueries({ queryKey: ["learning-paths-admin"] });
  };

  const createMutation = useMutation({
    mutationFn: () => createLearningPath({ title, description: description || undefined, courseIds: selectedCourseIds }),
    onSuccess: () => {
      invalidate();
      setTitle("");
      setDescription("");
      setSelectedCourseIds([]);
    },
  });
  const publishMutation = useMutation({ mutationFn: (id: string) => publishLearningPath(id), onSuccess: invalidate });

  const toggleCourse = (id: string) =>
    setSelectedCourseIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  const draftPaths = allPaths.data?.filter((p) => p.status === "Draft") ?? [];

  return (
    <>
      <form
        className="rounded-lg border border-dashed border-border p-3"
        onSubmit={(e) => {
          e.preventDefault();
          createMutation.mutate();
        }}
      >
        <div className="flex flex-wrap items-end gap-2">
          <label className="block flex-1 basis-52">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Title</span>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} className="input" />
          </label>
          <label className="block flex-1 basis-52">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Description</span>
            <input value={description} onChange={(e) => setDescription(e.target.value)} className="input" />
          </label>
          <button
            type="submit"
            disabled={createMutation.isPending || selectedCourseIds.length === 0}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
          >
            Create Path
          </button>
        </div>
        <p className="mb-1 mt-3 text-xs font-medium text-ink-muted">Courses (in order selected)</p>
        <div className="flex flex-wrap gap-2">
          {allCourses.data?.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => toggleCourse(c.id)}
              className={`rounded-lg border px-2 py-1 text-xs ${
                selectedCourseIds.includes(c.id) ? "border-primary bg-primary-soft text-primary" : "border-border"
              }`}
            >
              {selectedCourseIds.includes(c.id) && `${selectedCourseIds.indexOf(c.id) + 1}. `}
              {c.title}
            </button>
          ))}
        </div>
      </form>

      {draftPaths.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">Draft Paths</p>
          <ul className="space-y-2">
            {draftPaths.map((p) => (
              <li key={p.id} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
                <span>
                  {p.title} <span className="text-xs text-ink-faint">({p.courses.length} courses)</span>
                </span>
                <button
                  type="button"
                  onClick={() => publishMutation.mutate(p.id)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-primary"
                >
                  Publish
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
