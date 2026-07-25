import { useQuery } from "@tanstack/react-query";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { bankFileUrl, getPayrollRun } from "../../lib/api/payroll";
import { BankAdviceCell } from "./BankAdviceCell";

function money(value: number | null): string {
  return value === null ? "—" : `₹${value.toLocaleString("en-IN")}`;
}

/** Employee-level result drill-down for one run, including blocking-free exceptions (see PayrollRunService.process comment for why v1 never blocks). */
export function PayrollRunDetail({ runId }: { runId: string }) {
  const run = useQuery({ queryKey: ["payroll-run", runId], queryFn: () => getPayrollRun(runId) });

  if (run.isLoading) return <Card title="Run Detail">Loading…</Card>;
  if (!run.data) return null;
  const data = run.data;

  const exceptionCount = data.results.filter((r) => r.hasException).length;
  const canExportBankFile = data.status === "Approved" || data.status === "Closed";
  const canGenerateBankAdvice = canExportBankFile;

  return (
    <Card
      title={`Run Detail — ${data.periodMonth}/${data.periodYear}`}
      action={
        <div className="flex items-center gap-2">
          {exceptionCount > 0 && <Badge tone="warning">{exceptionCount} exception(s)</Badge>}
          {canExportBankFile && (
            <a
              href={bankFileUrl(data.id)}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover"
            >
              Download Bank File
            </a>
          )}
        </div>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs uppercase text-ink-faint">
            <tr>
              <th className="pb-2">Employee</th>
              <th className="pb-2">Payable Days</th>
              <th className="pb-2">Gross</th>
              <th className="pb-2">PF (Emp)</th>
              <th className="pb-2">ESIC (Emp)</th>
              <th className="pb-2">PT</th>
              <th className="pb-2">TDS</th>
              <th className="pb-2">Other Ded.</th>
              <th className="pb-2">Arrears</th>
              <th className="pb-2">Net Pay</th>
              {canGenerateBankAdvice && <th className="pb-2">Bank Advice</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.results.map((r) => (
              <tr key={r.id} className={r.hasException ? "bg-warning-soft/40" : undefined}>
                <td className="py-2">
                  {r.employee.legalName}
                  {r.hasException && (
                    <div className="text-xs text-warning">{r.exceptionNote}</div>
                  )}
                </td>
                <td className="py-2">
                  {r.payableDays}/{r.totalWorkingDays}
                </td>
                <td className="py-2">{money(r.grossEarnings)}</td>
                <td className="py-2">{money(r.pfEmployee)}</td>
                <td className="py-2">{money(r.esicEmployee)}</td>
                <td className="py-2">{money(r.professionalTax)}</td>
                <td className="py-2">{money(r.tds)}</td>
                <td className="py-2">{money(r.otherDeductions)}</td>
                <td className="py-2">{money(r.arrearsIncluded)}</td>
                <td className="py-2 font-semibold">{money(r.netPay)}</td>
                {canGenerateBankAdvice && (
                  <td className="py-2">{!r.hasException && <BankAdviceCell runId={data.id} employeeId={r.employeeId} />}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.results.length === 0 && <p className="text-ink-muted">No results yet — process this run.</p>}
    </Card>
  );
}
