const tones = {
  primary: "bg-primary",
  accent: "bg-accent",
  info: "bg-info",
} as const;

export function ProgressBar({
  value,
  tone = "primary",
}: {
  /** 0–100 */
  value: number;
  tone?: keyof typeof tones;
}) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-canvas">
      <div
        className={`h-full rounded-full ${tones[tone]}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
