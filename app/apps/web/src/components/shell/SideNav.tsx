import {
  BarChart3,
  Boxes,
  Briefcase,
  Building,
  Building2,
  CalendarCheck,
  CalendarDays,
  CalendarRange,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Clock,
  FlaskConical,
  Plug,
  UserCog,
  FileText,
  FileUp,
  FolderOpen,
  GraduationCap,
  HeartPulse,
  Headset,
  Home,
  ListChecks,
  Megaphone,
  Network,
  Receipt,
  Plane,
  Server,
  ScrollText,
  UploadCloud,
  Sparkles,
  UserCheck,
  UserPlus,
  Settings,
  ShieldCheck,
  Target,
  TrendingUp,
  User,
  Users,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthProvider";
import { RidzAvatar } from "../ui/RidzAvatar";

type NavItem = { label: string; to: string; icon: LucideIcon; disabled?: boolean };
type NavSection = { title: string; items: NavItem[] };

const APPROVER_ROLES = ["manager", "hr_ops", "org_admin"];
const PAYROLL_ADMIN_ROLES = ["org_admin", "hr_ops"];

/**
 * Navigation per board T-001: MY WORK / TEAM / ADMIN / GROWTH / RESOURCES /
 * MORE sections plus the Ask Staffsy AI card. Disabled entries are
 * registered destinations whose modules are not built yet. The Team/Admin
 * sections are role-aware — a first, partial step on the Phase 3
 * "permission-aware nav" deferral (most items are still role-blind).
 *
 * Sections render as an accordion (see SideNav below) — only one section's
 * items are expanded at a time, since Admin alone had grown past 19 links
 * and having every section always open made the panel unusable.
 */
function buildSections(roles: string[]): NavSection[] {
  const sections: NavSection[] = [
    {
      title: "My Work",
      items: [
        { label: "Home", to: "/home", icon: Home },
        { label: "My Profile", to: "/profile", icon: User },
        { label: "Attendance", to: "/attendance", icon: CalendarCheck },
        { label: "Workforce", to: "/workforce", icon: Clock },
        { label: "Leave", to: "/leave", icon: CalendarDays },
        { label: "Pay & Benefits", to: "/payslips", icon: Wallet },
        { label: "My Benefits", to: "/benefits", icon: Wallet },
        { label: "Recognition & Surveys", to: "/experience", icon: Sparkles },
        { label: "Expenses", to: "/expenses", icon: Receipt },
        { label: "Travel", to: "/travel", icon: Plane },
        { label: "Assets", to: "/assets", icon: Boxes },
        { label: "Workplace", to: "/workplace", icon: Building },
        { label: "Health & Safety", to: "/health-safety", icon: HeartPulse },
        { label: "Refer a Candidate", to: "/recruitment/refer", icon: UserPlus },
        { label: "Internal Jobs", to: "/recruitment/internal-jobs", icon: Briefcase },
        { label: "My Requests", to: "/requests", icon: FileText, disabled: true },
        { label: "Time Off Calendar", to: "/leave/calendar", icon: CalendarRange },
        { label: "My Onboarding", to: "/onboarding", icon: ListChecks },
      ],
    },
  ];

  if (roles.some((role) => APPROVER_ROLES.includes(role))) {
    sections.push({
      title: "Team",
      items: [{ label: "Approvals", to: "/approvals", icon: CheckSquare }],
    });
  }

  if (roles.some((role) => PAYROLL_ADMIN_ROLES.includes(role))) {
    sections.push({
      title: "Admin",
      items: [
        { label: "Payroll", to: "/payroll", icon: Wallet },
        { label: "Statutory Compliance", to: "/compliance", icon: ClipboardCheck },
        { label: "Integrations", to: "/integrations", icon: Plug },
        { label: "Recruitment", to: "/recruitment", icon: Briefcase },
        { label: "Talent Pool", to: "/recruitment/talent-pool", icon: Briefcase },
        { label: "Onboarding", to: "/onboarding/cases", icon: ListChecks },
        { label: "Bulk Import", to: "/people/employees/bulk-import", icon: FileUp },
        { label: "Talent 9-Box", to: "/talent", icon: Target },
        { label: "Succession Planning", to: "/talent/succession", icon: ShieldCheck },
        { label: "Compensation Planning", to: "/compensation-planning", icon: Wallet },
        { label: "Contractors", to: "/contractors", icon: UserCog },
        { label: "Calibration", to: "/performance/calibration", icon: TrendingUp },
        { label: "Organization Settings", to: "/organization", icon: Network },
        { label: "Audit Logs", to: "/security/audit-logs", icon: ScrollText },
        { label: "Access Reviews", to: "/security/access-reviews", icon: UserCheck },
        { label: "Compliance Overview", to: "/security/compliance-overview", icon: ClipboardCheck },
        { label: "Permissions Matrix", to: "/security/permissions-matrix", icon: UserCog },
        { label: "Operations", to: "/ops", icon: Server },
        { label: "Implementation & Migration", to: "/implementation", icon: UploadCloud },
        { label: "Testing & Quality", to: "/testing", icon: FlaskConical },
      ],
    });
  }

  sections.push(
    {
      title: "Growth",
      items: [
        { label: "Learning Catalog", to: "/learning", icon: GraduationCap },
        { label: "My Learning", to: "/learning/my", icon: ListChecks },
        { label: "Certifications", to: "/learning/certifications", icon: ShieldCheck },
        { label: "My Goals", to: "/goals", icon: Target },
        { label: "Performance", to: "/performance", icon: TrendingUp },
        { label: "360 Feedback", to: "/performance/360", icon: Users },
        { label: "Competencies", to: "/performance/competencies", icon: Sparkles },
        { label: "Check-ins", to: "/performance/check-ins", icon: CalendarCheck },
      ],
    },
    {
      title: "Resources",
      items: [
        { label: "Documents", to: "/documents", icon: FolderOpen },
        { label: "Policies", to: "/policies", icon: ShieldCheck, disabled: true },
        { label: "Announcements", to: "/communications", icon: Megaphone },
        { label: "Employees", to: "/people/employees", icon: Users },
        { label: "Reports", to: "/reports", icon: BarChart3 },
        { label: "Workforce Analytics", to: "/reports/analytics", icon: TrendingUp },
        { label: "Custom Reports", to: "/reports/custom", icon: FileUp },
      ],
    },
    {
      title: "More",
      items: [
        { label: "Company", to: "/company", icon: Building2, disabled: true },
        { label: "Settings", to: "/settings", icon: Settings },
        { label: "Help & Support", to: "/helpdesk", icon: Headset },
      ],
    },
  );

  return sections;
}

/** Picks the section whose item path most specifically matches the current route (longest match wins, so e.g. /performance/calibration resolves to Admin, not Growth's plain /performance). */
function findActiveSectionTitle(sections: NavSection[], pathname: string): string | null {
  let best: { title: string; length: number } | null = null;
  for (const section of sections) {
    for (const item of section.items) {
      if (item.disabled) continue;
      if (pathname === item.to || pathname.startsWith(`${item.to}/`)) {
        if (!best || item.to.length > best.length) {
          best = { title: section.title, length: item.to.length };
        }
      }
    }
  }
  return best?.title ?? null;
}

export function SideNav() {
  const { user } = useAuth();
  const location = useLocation();
  const sections = buildSections(user?.roles ?? []);

  const [openTitle, setOpenTitle] = useState<string | null>(() => findActiveSectionTitle(sections, location.pathname) ?? sections[0]?.title ?? null);

  // Accordion auto-follows navigation (e.g. via search or a quick action) so the active link is never hidden behind a collapsed group — a manual header click always overrides this.
  useEffect(() => {
    const activeTitle = findActiveSectionTitle(sections, location.pathname);
    if (activeTitle) setOpenTitle(activeTitle);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sections is derived fresh each render from roles, which don't change mid-session; keying on pathname alone avoids re-running on every render.
  }, [location.pathname]);

  return (
    <nav className="flex w-(--spacing-sidebar) shrink-0 flex-col overflow-y-auto border-r border-border bg-surface px-3 py-4">
      {sections.map((section) => {
        const isOpen = openTitle === section.title;
        return (
          <div key={section.title} className="mb-1">
            <button
              type="button"
              onClick={() => setOpenTitle(isOpen ? null : section.title)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-ink-faint hover:bg-primary-soft hover:text-primary"
              aria-expanded={isOpen}
            >
              {section.title}
              {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            </button>
            <div className={`overflow-hidden transition-all duration-200 ${isOpen ? "max-h-[999px] opacity-100" : "max-h-0 opacity-0"}`}>
              <ul className="space-y-0.5 pb-3 pt-0.5">
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
          </div>
        );
      })}

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
