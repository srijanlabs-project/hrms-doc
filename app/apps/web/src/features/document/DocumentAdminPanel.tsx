import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { listEmployees } from "../../lib/api/employees";
import { addDocumentVersion, archiveDocument, createDocument, listAllDocuments, listRetentionPolicies, publishDocument } from "../../lib/api/documents";
import { uploadFile } from "../../lib/api/files";
import { DocumentRow } from "./DocumentRow";

const CATEGORIES = ["Policy", "Contract", "Certificate", "Form", "Report", "Other"] as const;

/** org_admin/hr_ops: manage the HR document repository — upload, publish, archive, and version. */
export function DocumentAdminPanel() {
  const queryClient = useQueryClient();
  const documents = useQuery({ queryKey: ["documents-all"], queryFn: () => listAllDocuments() });
  const employees = useQuery({ queryKey: ["employees"], queryFn: listEmployees });
  const retentionPolicies = useQuery({ queryKey: ["retention-policies"], queryFn: listRetentionPolicies });

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Other");
  const [employeeId, setEmployeeId] = useState("");
  const [retentionPolicyId, setRetentionPolicyId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["documents-all"] });
    queryClient.invalidateQueries({ queryKey: ["documents-mine"] });
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("A file is required.");
      const { id: fileId } = await uploadFile(file);
      return createDocument({
        title,
        category,
        employeeId: employeeId || undefined,
        retentionPolicyId: retentionPolicyId || undefined,
        fileId,
      });
    },
    onSuccess: () => {
      setTitle("");
      setEmployeeId("");
      setRetentionPolicyId("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      invalidate();
    },
  });

  const publishMutation = useMutation({ mutationFn: (id: string) => publishDocument(id), onSuccess: invalidate });
  const archiveMutation = useMutation({ mutationFn: (id: string) => archiveDocument(id), onSuccess: invalidate });
  const versionMutation = useMutation({
    mutationFn: async ({ id, versionFile }: { id: string; versionFile: File }) => {
      const { id: fileId } = await uploadFile(versionFile);
      return addDocumentVersion(id, { fileId });
    },
    onSuccess: invalidate,
  });

  return (
    <Card title="Document Repository (Admin)">
      {createMutation.error instanceof ApiError && (
        <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{createMutation.error.message}</p>
      )}
      <form
        className="mb-4 flex flex-wrap items-end gap-2 border-b border-border pb-4"
        onSubmit={(e) => {
          e.preventDefault();
          createMutation.mutate();
        }}
      >
        <input required placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="input" />
        <select value={category} onChange={(e) => setCategory(e.target.value as (typeof CATEGORIES)[number])} className="input">
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="input">
          <option value="">Organization-wide</option>
          {employees.data?.map((e) => (
            <option key={e.id} value={e.id}>
              {e.legalName}
            </option>
          ))}
        </select>
        <select value={retentionPolicyId} onChange={(e) => setRetentionPolicyId(e.target.value)} className="input">
          <option value="">No retention policy</option>
          {retentionPolicies.data?.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.retentionMonths}mo)
            </option>
          ))}
        </select>
        <input
          required
          ref={fileInputRef}
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="input"
        />
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-50"
        >
          {createMutation.isPending ? "Uploading…" : "Upload"}
        </button>
      </form>

      <ul className="space-y-2">
        {documents.data?.map((doc) => (
          <DocumentRow
            key={doc.id}
            doc={doc}
            onPublish={(id) => publishMutation.mutate(id)}
            onArchive={(id) => archiveMutation.mutate(id)}
            onNewVersion={(id, versionFile) => versionMutation.mutate({ id, versionFile })}
          />
        ))}
        {documents.data?.length === 0 && <p className="text-sm text-ink-faint">No documents in the repository yet.</p>}
      </ul>
    </Card>
  );
}
