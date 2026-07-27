import { Badge } from "../../components/ui/Badge";
import { fileDownloadUrl } from "../../lib/api/files";
import type { DocumentRecord } from "../../lib/api/types";
import { documentStatusTone } from "./status-tone";

/** One repository row with admin actions — extracted from DocumentAdminPanel to keep it under the line limit. */
export function DocumentRow({
  doc,
  onPublish,
  onArchive,
  onNewVersion,
}: {
  doc: DocumentRecord;
  onPublish: (id: string) => void;
  onArchive: (id: string) => void;
  onNewVersion: (id: string, file: File) => void;
}) {
  const latest = doc.versions[0];

  return (
    <li className="rounded-lg border border-border p-3 text-sm">
      <div className="flex items-center justify-between">
        <span>
          {doc.title} <Badge tone="neutral">{doc.category}</Badge> <Badge tone={documentStatusTone(doc.status)}>{doc.status}</Badge>{" "}
          {doc.employee ? doc.employee.legalName : <span className="text-ink-faint">Organization-wide</span>}
        </span>
        {latest && (
          <a href={fileDownloadUrl(latest.fileId)} target="_blank" rel="noreferrer" className="text-primary hover:underline">
            v{latest.versionNumber}
          </a>
        )}
      </div>
      <div className="mt-2 flex items-center gap-2">
        {doc.status === "Draft" && (
          <button
            type="button"
            onClick={() => onPublish(doc.id)}
            className="rounded-lg bg-primary px-2 py-1 text-xs font-semibold text-white hover:bg-primary-hover"
          >
            Publish
          </button>
        )}
        {doc.status === "Published" && (
          <button
            type="button"
            onClick={() => onArchive(doc.id)}
            className="rounded-lg border border-border px-2 py-1 text-xs font-semibold hover:bg-surface-hover"
          >
            Archive
          </button>
        )}
        <label className="cursor-pointer rounded-lg border border-border px-2 py-1 text-xs font-semibold hover:bg-surface-hover">
          New Version
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              const versionFile = e.target.files?.[0];
              if (versionFile) onNewVersion(doc.id, versionFile);
            }}
          />
        </label>
      </div>
    </li>
  );
}
