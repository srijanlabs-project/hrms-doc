import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { KpiCard } from "../../components/ui/KpiCard";
import { listMyPayslips } from "../../lib/api/payroll";
import type { Payslip } from "../../lib/api/types";
import { IncentiveBonusPanel } from "./IncentiveBonusPanel";
import { LoanAdvancePanel } from "./LoanAdvancePanel";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function money(value: number | null): string {
  return value === null ? "—" : `₹${value.toLocaleString("en-IN")}`;
}

function PayslipDetail({ payslip }: { payslip: Payslip }) {
  const rows: [string, number | null][] = [
    ["Basic", payslip.basic],
    ["HRA", payslip.hra],
    ["Special Allowance", payslip.specialAllowance],
    ["Gross Earnings", payslip.grossEarnings],
    ["PF (Employee)", payslip.pfEmployee],
    ["ESIC (Employee)", payslip.esicEmployee],
    ["Professional Tax", payslip.professionalTax],
    ["TDS", payslip.tds],
  ];

  return (
    <Card
      title={`${MONTH_NAMES[payslip.payrollRun.periodMonth - 1]} ${payslip.payrollRun.periodYear}`}
    >
      <dl className="divide-y divide-border text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between py-2">
            <dt className="text-ink-muted">{label}</dt>
            <dd>{money(value)}</dd>
          </div>
        ))}
        <div className="flex justify-between py-2 text-base font-semibold">
          <dt>Net Pay</dt>
          <dd>{money(payslip.netPay)}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-ink-faint">
        Paid for {payslip.payableDays} of {payslip.totalWorkingDays} working days.
      </p>
    </Card>
  );
}

/** T-001 Payslip KPI destination + payslip history. Only Approved/Closed runs ever surface here (see PayrollRunRepository.findApprovedResultForEmployee). */
export function PayslipsPage() {
  const payslips = useQuery({ queryKey: ["payslips-my"], queryFn: listMyPayslips });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = payslips.data?.find((p) => p.id === selectedId) ?? payslips.data?.[0] ?? null;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Payslips</h1>
        <p className="text-ink-muted">Your approved payroll history.</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <KpiCard
          label="Latest Net Pay"
          value={money(payslips.data?.[0]?.netPay ?? null)}
          caption={
            payslips.data?.[0]
              ? `${MONTH_NAMES[payslips.data[0].payrollRun.periodMonth - 1]} ${payslips.data[0].payrollRun.periodYear}`
              : "No payslips yet"
          }
        />
        <KpiCard label="Payslips Available" value={String(payslips.data?.length ?? 0)} caption="All time" />
      </div>

      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1 space-y-2">
          {payslips.isLoading && <p className="text-ink-muted">Loading payslips…</p>}
          {payslips.data?.length === 0 && (
            <div className="rounded-(--radius-card) border border-border bg-surface p-8 text-center text-ink-muted">
              No approved payslips yet.
            </div>
          )}
          {payslips.data?.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedId(p.id)}
              className={`flex w-full items-center justify-between rounded-lg border p-4 text-left ${
                selected?.id === p.id ? "border-primary bg-primary-soft" : "border-border hover:border-primary"
              }`}
            >
              <span className="font-medium">
                {MONTH_NAMES[p.payrollRun.periodMonth - 1]} {p.payrollRun.periodYear}
              </span>
              <span className="text-ink-faint">{money(p.netPay)}</span>
            </button>
          ))}
        </div>

        {selected && <PayslipDetail payslip={selected} />}
      </div>

      <LoanAdvancePanel isAdmin={false} />
      <IncentiveBonusPanel isAdmin={false} />
    </div>
  );
}
