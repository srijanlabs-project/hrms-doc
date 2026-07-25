import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { fileDownloadUrl } from "../../lib/api/files";
import { generateDocument, listGeneratedDocuments, listTemplates } from "../../lib/api/document-generation";

/** Document Generation + Template engines (Foundation & Platform) — first real consumer of this quick action. */
export function GenerateLetterCard({ employeeId }: { employeeId: string }) {
  const queryClient = useQueryClient();
  const templates = useQuery({ queryKey: ["document-templates"], queryFn: listTemplates });
  const generated = useQuery({
    queryKey: ["generated-documents", employeeId],
    queryFn: () => listGeneratedDocuments(employeeId),
  });

  const [templateId, setTemplateId] = useState("");

  const generateMutation = useMutation({
    mutationFn: () => generateDocument(employeeId, templateId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["generated-documents", employeeId] }),
  });

  return (
    <Card title="Generate Letter">
      <form
        className="mb-3 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (templateId) generateMutation.mutate();
        }}
      >
        <select value={templateId} onChange={(e) => setTemplateId(e.target.value)} className="input flex-1">
          <option value="">Select a template…</option>
          {templates.data?.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={!templateId || generateMutation.isPending}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {generateMutation.isPending ? "Generating…" : "Generate"}
        </button>
      </form>
      <ul className="space-y-1">
        {generated.data?.map((doc) => (
          <li key={doc.id} className="text-sm">
            <a href={fileDownloadUrl(doc.file.id)} target="_blank" rel="noreferrer" className="text-primary hover:underline">
              {doc.file.originalName}
            </a>{" "}
            <span className="text-xs text-ink-faint">{new Date(doc.createdAt).toLocaleDateString("en-IN")}</span>
          </li>
        ))}
        {generated.data?.length === 0 && <p className="text-xs text-ink-faint">No letters generated yet.</p>}
      </ul>
    </Card>
  );
}
