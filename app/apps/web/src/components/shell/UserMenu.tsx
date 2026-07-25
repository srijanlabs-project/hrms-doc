import { ChevronDown, LogOut, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthProvider";
import { logout } from "../../lib/api/auth";

function formatRole(role: string): string {
  return role
    .split("_")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function UserMenu() {
  const { user, clear } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  async function handleLogout() {
    await logout();
    clear();
    navigate("/login", { replace: true });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-canvas"
      >
        <span
          aria-hidden
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft font-semibold text-primary"
        >
          {initials(user.displayName)}
        </span>
        <span className="hidden text-left lg:block">
          <span className="block font-semibold leading-tight">{user.displayName}</span>
          <span className="block text-xs leading-tight text-ink-faint">
            {user.roles.map(formatRole).join(", ") || "No role assigned"}
          </span>
        </span>
        <ChevronDown className="h-4 w-4 text-ink-faint" />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-2 w-56 rounded-(--radius-card) border border-border bg-surface p-2 shadow-(--shadow-raised)">
            <div className="border-b border-border px-2 pb-2">
              <div className="font-medium">{user.displayName}</div>
              <div className="text-xs text-ink-faint">{user.email}</div>
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                navigate("/security");
              }}
              className="mt-2 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-canvas"
            >
              <ShieldCheck className="h-4 w-4" /> Security
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-negative hover:bg-negative-soft"
            >
              <LogOut className="h-4 w-4" /> Log Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
