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

/** groupLabel clusters items under a small non-collapsible sub-header within an open persona panel — purely visual, no effect on gating. */
type NavItem = { label: string; to: string; icon: LucideIcon; disabled?: boolean; groupLabel?: string };
type NavSection = { title: string; items: NavItem[] };

const APPROVER_ROLES = ["manager", "hr_ops", "org_admin"];
const PAYROLL_ADMIN_ROLES = ["org_admin", "hr_ops"];

/**
 * Navigation grouped by persona rather than generic feature-area labels:
 * Employee (everyone) / Manager (manager, hr_ops, org_admin) / HR (hr_ops,
 * org_admin) / Tenant Org Admin (hr_ops, org_admin). This app's real
 * authorization model only has three roles today — `org_admin`, `hr_ops`,
 * `manager` — so "HR" and "Tenant Org Admin" are visibility-identical
 * (both gated on the same two roles); the split is a wayfinding aid over
 * the old flat 20-item "Admin" section, not a new permission boundary.
 * Personas the user asked about that don't correspond to any real login
 * role are deliberately not sections here: Platform Admin is the separate
 * key-gated /platform/provision flow (never appears in a logged-in
 * tenant's sidebar), and Visitors never authenticate into Staffsy at all
 * (they're records an employee/host manages, not a nav persona).
 *
 * Sections render as an accordion (see SideNav below) — only one section's
 * items are expanded at a time. Within an open section, groupLabel draws a
 * small uppercase sub-header whenever it changes from the previous item,
 * so a persona with many items (Employee, HR) still scans in clusters
 * instead of one long flat list.
 */
function buildSections(roles: string[]): NavSection[] {
  const sections: NavSection[] = [
    {
      title: "Employee",
      items: [
        { label: "Home", to: "/home", icon: Home, groupLabel: "Overview" },
        { label: "My Profile", to: "/profile", icon: User, groupLabel: "Overview" },

        { label: "Attendance", to: "/attendance", icon: CalendarCheck, groupLabel: "Time & Leave" },
        { label: "Workforce", to: "/workforce", icon: Clock, groupLabel: "Time & Leave" },
        { label: "Leave", to: "/leave", icon: CalendarDays, groupLabel: "Time & Leave" },
        { label: "Time Off Calendar", to: "/leave/calendar", icon: CalendarRange, groupLabel: "Time & Leave" },

        { label: "Pay & Benefits", to: "/payslips", icon: Wallet, groupLabel: "Pay & Benefits" },
        { label: "My Benefits", to: "/benefits", icon: Wallet, groupLabel: "Pay & Benefits" },

        { label: "Expenses", to: "/expenses", icon: Receipt, groupLabel: "Claims & Resources" },
        { label: "Travel", to: "/travel", icon: Plane, groupLabel: "Claims & Resources" },
        { label: "Assets", to: "/assets", icon: Boxes, groupLabel: "Claims & Resources" },
        { label: "Workplace", to: "/workplace", icon: Building, groupLabel: "Claims & Resources" },

        { label: "Health & Safety", to: "/health-safety", icon: HeartPulse, groupLabel: "Wellbeing & Recognition" },
        { label: "Recognition & Surveys", to: "/experience", icon: Sparkles, groupLabel: "Wellbeing & Recognition" },

        { label: "Refer a Candidate", to: "/recruitment/refer", icon: UserPlus, groupLabel: "Career" },
        { label: "Internal Jobs", to: "/recruitment/internal-jobs", icon: Briefcase, groupLabel: "Career" },
        { label: "My Onboarding", to: "/onboarding", icon: ListChecks, groupLabel: "Career" },
        { label: "My Requests", to: "/requests", icon: FileText, disabled: true, groupLabel: "Career" },

        { label: "Learning Catalog", to: "/learning", icon: GraduationCap, groupLabel: "Learning & Performance" },
        { label: "My Learning", to: "/learning/my", icon: ListChecks, groupLabel: "Learning & Performance" },
        { label: "Certifications", to: "/learning/certifications", icon: ShieldCheck, groupLabel: "Learning & Performance" },
        { label: "My Goals", to: "/goals", icon: Target, groupLabel: "Learning & Performance" },
        { label: "Performance", to: "/performance", icon: TrendingUp, groupLabel: "Learning & Performance" },
        { label: "360 Feedback", to: "/performance/360", icon: Users, groupLabel: "Learning & Performance" },
        { label: "Competencies", to: "/performance/competencies", icon: Sparkles, groupLabel: "Learning & Performance" },
        { label: "Check-ins", to: "/performance/check-ins", icon: CalendarCheck, groupLabel: "Learning & Performance" },

        { label: "Documents", to: "/documents", icon: FolderOpen, groupLabel: "Company Resources" },
        { label: "Policies", to: "/policies", icon: ShieldCheck, disabled: true, groupLabel: "Company Resources" },
        { label: "Announcements", to: "/communications", icon: Megaphone, groupLabel: "Company Resources" },

        { label: "Company", to: "/company", icon: Building2, disabled: true, groupLabel: "Settings & Support" },
        { label: "Settings", to: "/settings", icon: Settings, groupLabel: "Settings & Support" },
        { label: "Help & Support", to: "/helpdesk", icon: Headset, groupLabel: "Settings & Support" },
      ],
    },
  ];

  if (roles.some((role) => APPROVER_ROLES.includes(role))) {
    sections.push({
      title: "Manager",
      items: [{ label: "Approvals", to: "/approvals", icon: CheckSquare }],
    });
  }

  if (roles.some((role) => PAYROLL_ADMIN_ROLES.includes(role))) {
    sections.push({
      title: "HR",
      items: [
        { label: "Recruitment", to: "/recruitment", icon: Briefcase, groupLabel: "Recruitment & Talent" },
        { label: "Talent Pool", to: "/recruitment/talent-pool", icon: Briefcase, groupLabel: "Recruitment & Talent" },
        { label: "Onboarding", to: "/onboarding/cases", icon: ListChecks, groupLabel: "Recruitment & Talent" },
        { label: "Talent 9-Box", to: "/talent", icon: Target, groupLabel: "Recruitment & Talent" },
        { label: "Succession Planning", to: "/talent/succession", icon: ShieldCheck, groupLabel: "Recruitment & Talent" },
        { label: "Calibration", to: "/performance/calibration", icon: TrendingUp, groupLabel: "Recruitment & Talent" },
        { label: "Contractors", to: "/contractors", icon: UserCog, groupLabel: "Recruitment & Talent" },

        { label: "Payroll", to: "/payroll", icon: Wallet, groupLabel: "Payroll & Compensation" },
        { label: "Statutory Compliance", to: "/compliance", icon: ClipboardCheck, groupLabel: "Payroll & Compensation" },
        { label: "Compensation Planning", to: "/compensation-planning", icon: Wallet, groupLabel: "Payroll & Compensation" },

        { label: "Employees", to: "/people/employees", icon: Users, groupLabel: "People & Reports" },
        { label: "Reports", to: "/reports", icon: BarChart3, groupLabel: "People & Reports" },
        { label: "Workforce Analytics", to: "/reports/analytics", icon: TrendingUp, groupLabel: "People & Reports" },
        { label: "Custom Reports", to: "/reports/custom", icon: FileUp, groupLabel: "People & Reports" },
      ],
    });

    sections.push({
      title: "Tenant Org Admin",
      items: [
        { label: "Organization Settings", to: "/organization", icon: Network, groupLabel: "Organization" },
        { label: "Integrations", to: "/integrations", icon: Plug, groupLabel: "Organization" },

        { label: "Audit Logs", to: "/security/audit-logs", icon: ScrollText, groupLabel: "Security & Governance" },
        { label: "Access Reviews", to: "/security/access-reviews", icon: UserCheck, groupLabel: "Security & Governance" },
        { label: "Compliance Overview", to: "/security/compliance-overview", icon: ClipboardCheck, groupLabel: "Security & Governance" },
        { label: "Permissions Matrix", to: "/security/permissions-matrix", icon: UserCog, groupLabel: "Security & Governance" },

        { label: "Operations", to: "/ops", icon: Server, groupLabel: "Platform & Data" },
        { label: "Implementation & Migration", to: "/implementation", icon: UploadCloud, groupLabel: "Platform & Data" },
        { label: "Bulk Import", to: "/people/employees/bulk-import", icon: FileUp, groupLabel: "Platform & Data" },
        { label: "Testing & Quality", to: "/testing", icon: FlaskConical, groupLabel: "Platform & Data" },
      ],
    });
  }

  return sections;
}

/** Picks the section whose item path most specifically matches the current route (longest match wins, so e.g. /performance/calibration resolves to HR, not Employee's plain /performance). */
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
        let lastGroupLabel: string | undefined;
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
            <div className={`overflow-hidden transition-all duration-200 ${isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}>
              <ul className="space-y-0.5 pb-3 pt-0.5">
                {section.items.map((item) => {
                  const showGroupHeader = !!item.groupLabel && item.groupLabel !== lastGroupLabel;
                  lastGroupLabel = item.groupLabel;
                  return (
                    <li key={item.to}>
                      {showGroupHeader && (
                        <div className="mb-0.5 mt-2.5 px-3 text-[10px] font-semibold uppercase tracking-wide text-ink-faint/70 first:mt-0.5">
                          {item.groupLabel}
                        </div>
                      )}
                      {item.disabled ? (
                        <div
                          className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-ink-faint"
                          title="Coming soon"
                        >
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </div>
                      ) : (
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
                      )}
                    </li>
                  );
                })}
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
