const palette = [
  "bg-primary-soft text-primary",
  "bg-info-soft text-info",
  "bg-warning-soft text-warning",
  "bg-positive-soft text-positive",
];

export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
  const tone = palette[name.length % palette.length];
  const dims = size === "sm" ? "h-7 w-7 text-[11px]" : "h-9 w-9 text-xs";
  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${tone} ${dims}`}
    >
      {initials}
    </span>
  );
}
