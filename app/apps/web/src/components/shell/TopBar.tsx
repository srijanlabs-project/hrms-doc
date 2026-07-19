export function TopBar() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface">
      <div className="mx-auto flex h-16 max-w-(--container-shell) items-center gap-4 px-6">
        <a href="/" className="flex items-center gap-2 text-lg font-bold text-primary">
          <span aria-hidden className="inline-block h-6 w-6 rounded bg-primary" />
          Staffsy
        </a>
        <div className="mx-auto w-full max-w-xl">
          <input
            type="search"
            placeholder="Search for people, documents, policies, tickets…"
            className="w-full rounded-lg border border-border bg-canvas px-4 py-2 outline-none focus:border-primary"
          />
        </div>
        <button
          type="button"
          className="rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover"
        >
          + New Request
        </button>
        <div
          aria-label="Current user"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft font-semibold text-primary"
        >
          R
        </div>
      </div>
    </header>
  );
}
