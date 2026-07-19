import type { ReactNode } from "react";

export function Card({
  title,
  action,
  children,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-(--radius-card) border border-border bg-surface p-5 shadow-(--shadow-card)">
      {(title || action) && (
        <header className="mb-4 flex items-center justify-between">
          {title && <h2 className="font-semibold">{title}</h2>}
          {action}
        </header>
      )}
      {children}
    </section>
  );
}
