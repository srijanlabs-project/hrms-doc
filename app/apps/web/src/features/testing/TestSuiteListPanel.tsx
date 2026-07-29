import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { createTestSuite, listTestSuites, TEST_SUITE_TYPES, type TestSuiteType } from "../../lib/api/testing";
import { TestSuiteRow } from "./TestSuiteRow";

export function TestSuiteListPanel() {
  const queryClient = useQueryClient();
  const suites = useQuery({ queryKey: ["test-suites"], queryFn: listTestSuites });

  const [name, setName] = useState("");
  const [suiteType, setSuiteType] = useState<TestSuiteType>("Regression");
  const [description, setDescription] = useState("");

  const create = useMutation({
    mutationFn: () => createTestSuite({ name, suiteType, description: description || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["test-suites"] });
      setName("");
      setDescription("");
    },
  });
  const errorMessage = create.error instanceof ApiError ? create.error.message : undefined;

  return (
    <Card title="Test Suites">
      {errorMessage && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      <form
        className="mb-4 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          create.mutate();
        }}
      >
        <label className="block flex-1 basis-40">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Name</span>
          <input required value={name} onChange={(e) => setName(e.target.value)} className="input" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Type</span>
          <select value={suiteType} onChange={(e) => setSuiteType(e.target.value as TestSuiteType)} className="input w-40">
            {TEST_SUITE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="block flex-1 basis-52">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Description</span>
          <input value={description} onChange={(e) => setDescription(e.target.value)} className="input" />
        </label>
        <button
          type="submit"
          disabled={create.isPending}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          {create.isPending ? "Creating…" : "Add Suite"}
        </button>
      </form>

      <ul className="space-y-2">
        {suites.data?.map((suite) => (
          <TestSuiteRow key={suite.id} suite={suite} />
        ))}
        {suites.data?.length === 0 && <p className="text-ink-muted">No test suites yet.</p>}
      </ul>
    </Card>
  );
}
