import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { giveRecognition, listRecognitionFeed } from "../../lib/api/experience";
import { ApiError } from "../../lib/api/http";
import { listEmployees } from "../../lib/api/employees";
import { useAuth } from "../auth/AuthProvider";

const RECOGNITION_VALUES = [
  "Teamwork",
  "Innovation",
  "Customer Focus",
  "Excellence",
  "Leadership",
  "Going the Extra Mile",
] as const;

/** Self-service: peer-to-peer kudos with an org-wide feed. No approval workflow — see schema.prisma's Recognition comment. */
export function RecognitionPanel() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const feed = useQuery({ queryKey: ["recognition-feed"], queryFn: listRecognitionFeed });
  const employees = useQuery({ queryKey: ["employees"], queryFn: listEmployees });

  const [toEmployeeId, setToEmployeeId] = useState("");
  const [value, setValue] = useState<(typeof RECOGNITION_VALUES)[number]>("Teamwork");
  const [message, setMessage] = useState("");

  const give = useMutation({
    mutationFn: () => giveRecognition({ toEmployeeId, value, message }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["recognition-feed"] });
      setToEmployeeId("");
      setMessage("");
    },
  });
  const errorMessage = give.error instanceof ApiError ? give.error.message : undefined;
  const otherEmployees = employees.data?.filter((e) => e.id !== user?.employeeId);

  return (
    <Card title="Recognition">
      {errorMessage && <p className="mb-3 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      <form
        className="mb-4 flex flex-wrap items-end gap-2 border-b border-border pb-4"
        onSubmit={(e) => {
          e.preventDefault();
          give.mutate();
        }}
      >
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Recognize</span>
          <select required value={toEmployeeId} onChange={(e) => setToEmployeeId(e.target.value)} className="input w-48">
            <option value="">Select…</option>
            {otherEmployees?.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.legalName}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">For</span>
          <select value={value} onChange={(e) => setValue(e.target.value as typeof value)} className="input w-44">
            {RECOGNITION_VALUES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label className="block flex-1">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Message</span>
          <input
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Say what they did well…"
            className="input w-full"
          />
        </label>
        <button
          type="submit"
          disabled={give.isPending}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          {give.isPending ? "Sending…" : "Give Kudos"}
        </button>
      </form>

      <ul className="space-y-2">
        {feed.data?.map((r) => (
          <li key={r.id} className="rounded-lg border border-border p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {r.fromEmployee.legalName} → {r.toEmployee.legalName}
              </span>
              <Badge tone="positive">{r.value}</Badge>
            </div>
            <p className="mt-1 text-sm text-ink-muted">{r.message}</p>
            <p className="mt-1 text-xs text-ink-faint">
              +{r.points} pts · {new Date(r.createdAt).toLocaleDateString("en-IN")}
            </p>
          </li>
        ))}
        {feed.data?.length === 0 && <p className="text-ink-muted">No recognitions yet — be the first to give kudos.</p>}
      </ul>
    </Card>
  );
}
