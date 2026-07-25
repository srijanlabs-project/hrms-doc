import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { fileDownloadUrl, uploadFile } from "../../lib/api/files";
import { addEmployeeDocument, addIdentityDocument, getCareer, getIdentityFinance } from "../../lib/api/people-extras";

const DOCUMENT_TYPES = ["OfferLetter", "Payslip", "Certificate", "IdProof", "Contract", "Other"];
const IDENTITY_TYPES = ["PAN", "Aadhaar", "Passport", "DrivingLicense", "VoterID", "NationalID", "Visa", "Other"];

/** Consolidates employee documents and national identity/passport/visa/driving-license records, both backed by the File Storage engine. No digital-signature capability. */
export function DocumentsTab({ employeeId }: { employeeId: string }) {
  const queryClient = useQueryClient();
  const career = useQuery({ queryKey: ["career", employeeId], queryFn: () => getCareer(employeeId) });
  const identityFinance = useQuery({ queryKey: ["identity-finance", employeeId], queryFn: () => getIdentityFinance(employeeId) });

  const [documentType, setDocumentType] = useState("Certificate");
  const [title, setTitle] = useState("");
  const [docFile, setDocFile] = useState<File | null>(null);
  const docFileInputRef = useRef<HTMLInputElement>(null);

  const [idType, setIdType] = useState("PAN");
  const [documentNumber, setDocumentNumber] = useState("");
  const [idFile, setIdFile] = useState<File | null>(null);
  const idFileInputRef = useRef<HTMLInputElement>(null);

  const docMutation = useMutation({
    mutationFn: async () => {
      const fileId = docFile ? (await uploadFile(docFile)).id : undefined;
      return addEmployeeDocument(employeeId, { documentType, title, fileId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career", employeeId] });
      setTitle("");
      setDocFile(null);
      if (docFileInputRef.current) docFileInputRef.current.value = "";
    },
  });

  const idMutation = useMutation({
    mutationFn: async () => {
      const fileId = idFile ? (await uploadFile(idFile)).id : undefined;
      return addIdentityDocument(employeeId, { documentType: idType, documentNumber, fileId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["identity-finance", employeeId] });
      setDocumentNumber("");
      setIdFile(null);
      if (idFileInputRef.current) idFileInputRef.current.value = "";
    },
  });

  return (
    <div className="space-y-4">
      <Card title="Employee Documents">
        <form
          className="mb-3 flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            docMutation.mutate();
          }}
        >
          <select value={documentType} onChange={(e) => setDocumentType(e.target.value)} className="input w-36">
            {DOCUMENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input required placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="input flex-1 basis-40" />
          <input
            ref={docFileInputRef}
            type="file"
            onChange={(e) => setDocFile(e.target.files?.[0] ?? null)}
            className="input flex-1 basis-40"
          />
          <button
            type="submit"
            disabled={docMutation.isPending}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover"
          >
            {docMutation.isPending ? "Uploading…" : "Add Document"}
          </button>
        </form>
        <ul className="space-y-1">
          {career.data?.documents.map((d) => (
            <li key={d.id} className="rounded-lg border border-border p-2 text-sm">
              <span className="font-medium">{d.title}</span> <Badge tone="neutral">{d.documentType}</Badge>{" "}
              <Badge tone="positive">{d.status}</Badge>
              {d.file && (
                <>
                  {" · "}
                  <a href={fileDownloadUrl(d.file.id)} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                    {d.file.originalName}
                  </a>
                </>
              )}
            </li>
          ))}
          {career.data?.documents.length === 0 && <p className="text-xs text-ink-faint">No documents uploaded.</p>}
        </ul>
      </Card>

      <Card title="Identity Documents">
        <form
          className="mb-3 flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            idMutation.mutate();
          }}
        >
          <select value={idType} onChange={(e) => setIdType(e.target.value)} className="input w-36">
            {IDENTITY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input required placeholder="Document Number" value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)} className="input" />
          <input
            ref={idFileInputRef}
            type="file"
            onChange={(e) => setIdFile(e.target.files?.[0] ?? null)}
            className="input flex-1 basis-40"
          />
          <button
            type="submit"
            disabled={idMutation.isPending}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover"
          >
            {idMutation.isPending ? "Uploading…" : "Add"}
          </button>
        </form>
        <ul className="space-y-1">
          {identityFinance.data?.identityDocuments.map((d) => (
            <li key={d.id} className="rounded-lg border border-border p-2 text-sm">
              {d.documentType}: {d.documentNumber} <Badge tone="warning">{d.status}</Badge>
              {d.file && (
                <>
                  {" · "}
                  <a href={fileDownloadUrl(d.file.id)} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                    {d.file.originalName}
                  </a>
                </>
              )}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
