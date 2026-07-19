import {
  BarChart3,
  Building2,
  CalendarCheck,
  CalendarDays,
  CalendarRange,
  CheckSquare,
  FileText,
  FolderOpen,
  GraduationCap,
  HelpCircle,
  Home,
  Settings,
  ShieldCheck,
  Target,
  TrendingUp,
  User,
  Users,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthProvider";
import { RidzAvatar } from "../ui/RidzAvatar";

type NavItem = { label: string; to: string; icon: LucideIcon; disabled?: boolean };
type NavSection = { title: string; items: NavItem[] };

const APPROVER_ROLES = ["manager", "hr_ops", "org_admin"];

/**
 * Navigation per board T-001: MY WORK / GROWTH / RESOURCES / MORE sections
 * plus the Ask Staffsy AI card. Disabled entries are registered destinations
 * whose modules are not built yet. The Team section is role-aware — a first,
 * partial step on the Phase 3 "permission-aware nav" deferral (still only
 * this one item; most of the nav remains role-blind).
 */
function buildSections(roles: string[]): NavSection[] {
  const sections: NavSection[] = [
    {
      title: "My Work",
      items: [
        { label: "Home", to: "/home", icon: Home },
        { label: "My Profile", to: "/profile", icon: User, disabled: true },
        { label: "Attendance", to: "/attendance", icon: CalendarCheck, disabled: true },
        { label: "Leave", to: "/leave", icon: CalendarDays },
        { label: "Pay & Benefits", to: "/pay", icon: Wallet, disabled: true },
        { label: "My Requests", to: "/requests", icon: FileText, disabled: true },
        { label: "Time Off Calendar", to: "/leave/calendar", icon: CalendarRange },
      ],
    },
  ];

  if (roles.some((role) => APPROVER_ROLES.includes(role))) {
    sections.push({
      title: "Team",
      items: [{ label: "Approvals", to: "/approvals", icon: CheckSquare }],
    });
  }

  sections.push(
    {
      title: "Growth",
      items: [
        { label: "Learning", to: "/learning", icon: GraduationCap, disabled: true },
        { label: "My Goals", to: "/goals", icon: Target, disabled: true },
        { label: "Performance", to: "/performance", icon: TrendingUp, disabled: true },
      ],
    },
    {
      title: "Resources",
      items: [
        { label: "Documents", to: "/documents", icon: FolderOpen, disabled: true },
        { label: "Policies", to: "/policies", icon: ShieldCheck, disabled: true },
        { label: "Employees", to: "/people/employees", icon: Users },
        { label: "Reports", to: "/reports", icon: BarChart3, disabled: true },
      ],
    },
    {
      title: "More",
      items: [
        { label: "Company", to: "/company", icon: Building2, disabled: true },
        { label: "Settings", to: "/settings", icon: Settings, disabled: true },
        { label: "Help & Support", to: "/help", icon: HelpCircle, disabled: true },
      ],
    },
  );

  return sections;
}

export function SideNav() {
  const { user } = useAuth();
  const sections = buildSections(user?.roles ?? []);

  return (
    <nav className="flex w-(--spacing-sidebar) shrink-0 flex-col border-r border-border bg-surface px-3 py-4">
      {sections.map((section) => (
        <div key={section.title} className="mb-5">
          <div className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
            {section.title}
          </div>
          <ul className="space-y-0.5">
            {section.items.map((item) =>
              item.disabled ? (
                <li
                  key={item.to}
                  className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-ink-faint"
                  title="Coming soon"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </li>
              ) : (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2 font-medium ${
                        isActive
                          ? "bg-primary text-white"
                          : "text-ink hover:bg-primary-soft hover:text-primary"
                      }`
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                </li>
              ),
            )}
          </ul>
        </div>
      ))}

      {/* Ask Ridz card (Staffsy AI assistant), per board T-001 */}
      <div className="mt-auto rounded-(--radius-card) bg-primary-soft p-4">
        <div className="flex items-center gap-2 font-semibold text-primary">
          <RidzAvatar size={28} />
          Ask Ridz
        </div>
        <p className="mt-1 text-xs text-ink-muted">Your smart HR assistant</p>
        <button
          type="button"
          className="mt-3 w-full rounded-lg bg-surface px-3 py-1.5 text-xs font-semibold text-primary shadow-(--shadow-card) hover:bg-primary hover:text-white"
        >
          Start Chat →
        </button>
      </div>
    </nav>
  );
}
