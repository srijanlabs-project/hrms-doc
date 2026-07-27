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
  ClipboardCheck,
  Clock,
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
  Sparkles,
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
import { NavLink } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthProvider";
import { RidzAvatar } from "../ui/RidzAvatar";

type NavItem = { label: string; to: string; icon: LucideIcon; disabled?: boolean };
type NavSection = { title: string; items: NavItem[] };

const APPROVER_ROLES = ["manager", "hr_ops", "org_admin"];
const PAYROLL_ADMIN_ROLES = ["org_admin", "hr_ops"];

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
        { label: "Onboarding", to: "/onboarding/cases", icon: ListChecks },
        { label: "Bulk Import", to: "/people/employees/bulk-import", icon: FileUp },
        { label: "Talent 9-Box", to: "/talent", icon: Target },
        { label: "Succession Planning", to: "/talent/succession", icon: ShieldCheck },
        { label: "Compensation Planning", to: "/compensation-planning", icon: Wallet },
        { label: "Contractors", to: "/contractors", icon: UserCog },
        { label: "Calibration", to: "/performance/calibration", icon: TrendingUp },
        { label: "Organization Settings", to: "/organization", icon: Network },
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
