import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import {
  createDesignation,
  createJobFamily,
  createJobFunction,
  listDesignations,
  listJobFamilies,
  listJobFunctions,
} from "../../lib/api/org-settings";

const CAREER_TRACKS = ["IC", "Managerial"];

/** Job family, job function, and designation (with career track folded in) — the workforce job architecture catalog. */
export function JobArchitectureSection() {
  const queryClient = useQueryClient();
  const jobFamilies = useQuery({ queryKey: ["job-families"], queryFn: listJobFamilies });
  const jobFunctions = useQuery({ queryKey: ["job-functions"], queryFn: listJobFunctions });
  const designations = useQuery({ queryKey: ["designations"], queryFn: listDesignations });

  const [familyCode, setFamilyCode] = useState("");
  const [familyName, setFamilyName] = useState("");
  const familyMutation = useMutation({
    mutationFn: () => createJobFamily({ code: familyCode, name: familyName }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-families"] });
      setFamilyCode("");
      setFamilyName("");
    },
  });

  const [functionCode, setFunctionCode] = useState("");
  const [functionName, setFunctionName] = useState("");
  const [functionFamilyId, setFunctionFamilyId] = useState("");
  const functionMutation = useMutation({
    mutationFn: () =>
      createJobFunction({ code: functionCode, name: functionName, jobFamilyId: functionFamilyId || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-functions"] });
      setFunctionCode("");
      setFunctionName("");
      setFunctionFamilyId("");
    },
  });

  const [designationCode, setDesignationCode] = useState("");
  const [designationTitle, setDesignationTitle] = useState("");
  const [careerTrack, setCareerTrack] = useState("IC");
  const designationMutation = useMutation({
    mutationFn: () => createDesignation({ code: designationCode, title: designationTitle, careerTrack }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["designations"] });
      setDesignationCode("");
      setDesignationTitle("");
    },
  });

  return (
    <Card title="Job Architecture (Family / Function / Designation / Career Track)">
      <div className="space-y-4">
        <form
          className="flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            familyMutation.mutate();
          }}
        >
          <span className="w-28 text-xs font-semibold text-ink-muted">Job Family</span>
          <input
            required
            placeholder="Code"
            value={familyCode}
            onChange={(e) => setFamilyCode(e.target.value.toUpperCase())}
            className="input w-28"
          />
          <input
            required
            placeholder="Name"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            className="input flex-1 basis-40"
          />
          <button type="submit" className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover">
            Add
          </button>
          <span className="basis-full text-xs text-ink-faint">
            {jobFamilies.data?.map((f) => f.name).join(", ") || "None yet"}
          </span>
        </form>

        <form
          className="flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            functionMutation.mutate();
          }}
        >
          <span className="w-28 text-xs font-semibold text-ink-muted">Job Function</span>
          <input
            required
            placeholder="Code"
            value={functionCode}
            onChange={(e) => setFunctionCode(e.target.value.toUpperCase())}
            className="input w-28"
          />
          <input
            required
            placeholder="Name"
            value={functionName}
            onChange={(e) => setFunctionName(e.target.value)}
            className="input flex-1 basis-40"
          />
          <select value={functionFamilyId} onChange={(e) => setFunctionFamilyId(e.target.value)} className="input">
            <option value="">No family</option>
            {jobFamilies.data?.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
          <button type="submit" className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover">
            Add
          </button>
          <span className="basis-full text-xs text-ink-faint">
            {jobFunctions.data?.map((f) => f.name).join(", ") || "None yet"}
          </span>
        </form>

        <form
          className="flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            designationMutation.mutate();
          }}
        >
          <span className="w-28 text-xs font-semibold text-ink-muted">Designation</span>
          <input
            required
            placeholder="Code"
            value={designationCode}
            onChange={(e) => setDesignationCode(e.target.value.toUpperCase())}
            className="input w-28"
          />
          <input
            required
            placeholder="Title"
            value={designationTitle}
            onChange={(e) => setDesignationTitle(e.target.value)}
            className="input flex-1 basis-40"
          />
          <select value={careerTrack} onChange={(e) => setCareerTrack(e.target.value)} className="input w-32">
            {CAREER_TRACKS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <button type="submit" className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover">
            Add
          </button>
          <span className="basis-full text-xs text-ink-faint">
            {designations.data?.map((d) => `${d.title} (${d.careerTrack})`).join(", ") || "None yet"}
          </span>
        </form>
      </div>
    </Card>
  );
}
