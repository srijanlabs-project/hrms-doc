type Props = {
  label: string;
  value: string;
  caption?: string;
};

/** KPI summary card per the stat-card pattern shared across all template boards. */
export function KpiCard({ label, value, caption }: Props) {
  return (
    <div className="rounded-(--radius-card) border border-border bg-surface p-5 shadow-(--shadow-card)">
      <div className="text-ink-muted">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
      {caption && <div className="mt-1 text-xs text-ink-faint">{caption}</div>}
    </div>
  );
}
