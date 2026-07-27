import { useQuery } from "@tanstack/react-query";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { fileDownloadUrl } from "../../lib/api/files";
import { listMyDocuments } from "../../lib/api/documents";
import { documentStatusTone } from "./status-tone";

/** Read-only for every employee: my own documents plus organization-wide published documents (e.g. policies). */
export function DocumentRepositoryPanel() {
  const documents = useQuery({ queryKey: ["documents-mine"], queryFn: listMyDocuments });

  return (
    <Card title="My Documents">
      <ul className="space-y-2">
        {documents.data?.map((doc) => {
          const latest = doc.versions[0];
          return (
            <li key={doc.id} className="rounded-lg border border-border p-3 text-sm">
              <div className="flex items-center justify-between">
                <span>
                  {doc.title} <Badge tone="neutral">{doc.category}</Badge>{" "}
                  <Badge tone={documentStatusTone(doc.status)}>{doc.status}</Badge>
                  {doc.employeeId === null && <Badge tone="info">Organization-wide</Badge>}
                </span>
                {latest && (
                  <a href={fileDownloadUrl(latest.fileId)} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                    View (v{latest.versionNumber})
                  </a>
                )}
              </div>
            </li>
          );
        })}
        {documents.data?.length === 0 && <p className="text-sm text-ink-faint">No documents available yet.</p>}
      </ul>
    </Card>
  );
}
