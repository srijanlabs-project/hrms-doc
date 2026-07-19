import { Bell, ChevronDown, HelpCircle, LayoutGrid, Mail, Menu, Plus, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { UserMenu } from "./UserMenu";

function IconButton({ icon: Icon, badge, label }: { icon: LucideIcon; badge?: number; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="relative rounded-lg p-2 text-ink-muted hover:bg-canvas hover:text-ink"
    >
      <Icon className="h-5 w-5" />
      {badge !== undefined && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-negative px-1 text-[10px] font-bold text-white">
          {badge}
        </span>
      )}
    </button>
  );
}

/** Top command bar per board T-001: hamburger, logo, ⌘K search, New Request, alert icons, user. */
export function TopBar() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface">
      <div className="mx-auto flex h-16 max-w-(--container-shell) items-center gap-3 px-4">
        <button
          type="button"
          aria-label="Toggle navigation"
          className="rounded-lg p-2 text-ink-muted hover:bg-canvas hover:text-ink"
        >
          <Menu className="h-5 w-5" />
        </button>

        <a href="/" className="flex items-center gap-2 text-lg font-bold text-primary">
          <span aria-hidden className="inline-block h-6 w-6 rounded bg-primary" />
          Staffsy
        </a>

        <div className="mx-auto w-full max-w-xl">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-canvas px-3 py-2 focus-within:border-primary">
            <Search className="h-4 w-4 shrink-0 text-ink-faint" />
            <input
              type="search"
              placeholder="Search for people, documents, policies, tickets…"
              className="w-full bg-transparent outline-none placeholder:text-ink-faint"
            />
            <kbd className="shrink-0 rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-semibold text-ink-faint">
              ⌘K
            </kbd>
          </div>
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover"
        >
          <Plus className="h-4 w-4" /> New Request
          <ChevronDown className="h-4 w-4" />
        </button>

        <div className="flex items-center">
          <IconButton icon={Bell} badge={3} label="Notifications" />
          <IconButton icon={Mail} badge={2} label="Messages" />
          <IconButton icon={HelpCircle} label="Help" />
          <IconButton icon={LayoutGrid} label="Apps" />
        </div>

        <UserMenu />
      </div>
    </header>
  );
}
