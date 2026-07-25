import { useMutation } from "@tanstack/react-query";
import { fileDownloadUrl } from "../../lib/api/files";
import { generateBankAdvice } from "../../lib/api/payroll";

/** Per-employee salary advice letter, generated on demand — distinct from the run-level bank-file CSV export. */
export function BankAdviceCell({ runId, employeeId }: { runId: string; employeeId: string }) {
  const generateMutation = useMutation({ mutationFn: () => generateBankAdvice(runId, employeeId) });

  if (generateMutation.data) {
    return (
      <a
        href={fileDownloadUrl(generateMutation.data.fileId)}
        target="_blank"
        rel="noreferrer"
        className="text-xs font-semibold text-primary hover:underline"
      >
        Download
      </a>
    );
  }

  return (
    <button
      type="button"
      disabled={generateMutation.isPending}
      onClick={() => generateMutation.mutate()}
      className="rounded-lg border border-border px-2 py-1 text-xs font-semibold hover:bg-surface-hover disabled:opacity-60"
    >
      {generateMutation.isPending ? "Generating…" : "Bank Advice"}
    </button>
  );
}
