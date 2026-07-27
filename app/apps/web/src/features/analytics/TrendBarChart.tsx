type Bar = { label: string; value: number };

/**
 * Hand-rolled CSS bar chart — no charting library is installed in this
 * project (package.json has no recharts/chart.js/d3/etc.), and one hardcoded
 * trend chart doesn't justify adding a new dependency.
 */
export function TrendBarChart({ bars, valueSuffix = "" }: { bars: Bar[]; valueSuffix?: string }) {
  const max = Math.max(1, ...bars.map((b) => b.value));

  return (
    <div className="flex h-40 items-end gap-2 overflow-x-auto">
      {bars.map((bar) => (
        <div key={bar.label} className="flex min-w-10 flex-1 flex-col items-center gap-1">
          <span className="text-[11px] font-semibold tabular-nums text-ink-muted">
            {bar.value}
            {valueSuffix}
          </span>
          <div
            className="w-full rounded-t-md bg-primary transition-all"
            style={{ height: `${Math.max(4, (bar.value / max) * 100)}px` }}
          />
          <span className="text-[10px] text-ink-faint">{bar.label}</span>
        </div>
      ))}
    </div>
  );
}
