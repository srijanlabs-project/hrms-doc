import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  FileText,
  Home,
  IndianRupee,
  LayoutGrid,
  Receipt,
  Settings2,
  Upload,
} from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Avatar } from "../components/ui/Avatar";
import { Badge, type BadgeTone } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { ProgressBar } from "../components/ui/ProgressBar";
import { useAuth } from "../features/auth/AuthProvider";
import { RidzAssistantCard } from "../features/ai/RidzAssistantCard";
import { listMyAttendance } from "../lib/api/attendance";
import { listPublishedAnnouncements } from "../lib/api/communication";
import { listLeaveBalances } from "../lib/api/leave";
import { listMyGoals } from "../lib/api/performance";
import { listMyPayslips } from "../lib/api/payroll";
import { getRequestsSummary } from "../lib/api/requests-hub";

/**
 * T-001 My Staffsy Workspace — employee landing page.
 * Structure mirrors board T001.png: greeting header, KPI row, My Actions,
 * My Tasks / Announcements / My Day, AI assistant + team right rail, and the
 * schedule/goals/who's-out bottom row. Data is placeholder until the People,
 * Leave, and Workflow services land.
 */

const actions = [
  { label: "Apply Leave", icon: CalendarDays, to: "/leave/apply" },
  { label: "Mark Attendance", icon: CalendarCheck, to: "/attendance" },
  { label: "My Requests", icon: FileText, to: "/requests" },
  { label: "View Payslip", icon: IndianRupee, to: "/payslips" },
  { label: "Claim Expense", icon: Receipt, to: "/expenses" },
  { label: "Upload Document", icon: Upload },
  { label: "Request WFH", icon: Home },
  { label: "More Actions", icon: LayoutGrid },
];

const tasks: { title: string; due: string; tone: BadgeTone; chip: string }[] = [
  { title: "Design system review", due: "Due today · UI components", tone: "negative", chip: "High" },
  { title: "Complete performance self review", due: "Due in 2 days", tone: "warning", chip: "Medium" },
  { title: "Cyber security training", due: "Due in 5 days · Mandatory", tone: "neutral", chip: "Low" },
  { title: "Update emergency contact", due: "Due in 7 days", tone: "neutral", chip: "Low" },
];

const myDay = [
  { time: "09:30 AM", title: "Team Standup", detail: "30 mins" },
  { time: "11:00 AM", title: "Product Roadmap Review", detail: "1 hr" },
  { time: "02:00 PM", title: "1:1 with Manager", detail: "30 mins" },
  { time: "04:00 PM", title: "Learning: Leadership 101", detail: "45 mins" },
];

const team = [
  { name: "Rohit Singh", role: "Engineering Manager", status: "Online", tone: "positive" as BadgeTone },
  { name: "Priya Patel", role: "Sr. Product Designer", status: "Online", tone: "positive" as BadgeTone },
  { name: "Alyin Mehta", role: "Data Analyst", status: "In Meeting", tone: "warning" as BadgeTone },
  { name: "Sneha Reddy", role: "HR Executive", status: "Offline", tone: "neutral" as BadgeTone },
];

const events = [
  { date: "AUG 15", title: "Independence Day", detail: "Office Holiday" },
  { date: "AUG 21", title: "Team Offsite", detail: "Bangalore" },
];

const whosOut = [
  { name: "Sneha Iyer", range: "16 – 18 Jul" },
  { name: "Karan Shah", range: "16 Jul" },
  { name: "Ananya Kapoor", range: "17 – 19 Jul" },
];

function SectionLink({ children = "View All", to }: { children?: ReactNode; to?: string }) {
  const content = (
    <>
      {children} <ArrowRight className="h-3 w-3" />
    </>
  );
  if (to) {
    return (
      <Link to={to} className="flex items-center gap-1 text-xs font-medium text-primary">
        {content}
      </Link>
    );
  }
  return (
    <button type="button" className="flex items-center gap-1 text-xs font-medium text-primary">
      {content}
    </button>
  );
}

export function MyStaffsyPage() {
  const { user } = useAuth();
  const balances = useQuery({ queryKey: ["leave-balances"], queryFn: listLeaveBalances });
  const totalAvailable = balances.data?.reduce((sum, b) => sum + b.available, 0);

  const todayIso = new Date().toISOString().slice(0, 10);
  const attendance = useQuery({
    queryKey: ["attendance-my", todayIso],
    queryFn: () => listMyAttendance(todayIso, todayIso),
  });
  const todayAttendanceStatus = attendance.data?.[0]?.status ?? "Not Marked";

  const payslips = useQuery({ queryKey: ["payslips-my"], queryFn: listMyPayslips });
  const latestPayslip = payslips.data?.[0];

  const goals = useQuery({ queryKey: ["goals-my"], queryFn: listMyGoals });
  const activeGoals = goals.data?.filter((g) => g.status === "Active") ?? [];

  const requestsSummary = useQuery({ queryKey: ["requests-summary"], queryFn: getRequestsSummary });
  const announcements = useQuery({ queryKey: ["announcements"], queryFn: listPublishedAnnouncements });

  const kpis = [
    {
      label: "Leave Balance",
      value: totalAvailable === undefined ? "—" : String(Math.round(totalAvailable * 100) / 100),
      caption: "Days Available",
      link: "View Details",
      to: "/leave",
    },
    {
      label: "Attendance",
      value: todayAttendanceStatus,
      caption: "Today",
      link: "Mark / View",
      to: "/attendance",
    },
    {
      label: "Pending Tasks",
      value: requestsSummary.data ? String(requestsSummary.data.pending) : "—",
      caption: "Awaiting a decision",
      link: "View Details",
      to: "/requests",
    },
    {
      label: "Requests",
      value: requestsSummary.data ? String(requestsSummary.data.total) : "—",
      caption: "Total submitted",
      link: "View Details",
      to: "/requests",
    },
    {
      label: "Payslip",
      value: latestPayslip ? `₹${latestPayslip.netPay?.toLocaleString("en-IN") ?? "—"}` : "—",
      caption: latestPayslip ? "Latest net pay" : "No payslips yet",
      link: "View Details",
      to: "/payslips",
    },
  ];

  const firstName = (user?.displayName ?? "there").split(" ")[0];
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex gap-6">
      {/* Main column */}
      <div className="min-w-0 flex-1 space-y-6">
        <header className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Good morning, {firstName}! 👋</h1>
            <p className="mt-1 text-ink-muted">{today} · Pune Office</p>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 font-medium hover:border-primary"
          >
            <Settings2 className="h-4 w-4" /> Customize
          </button>
        </header>

        {/* KPI row */}
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="flex flex-col rounded-(--radius-card) border border-border bg-surface p-4 shadow-(--shadow-card)"
            >
              <div className="text-ink-muted">{kpi.label}</div>
              <div className="mt-1 text-2xl font-bold">{kpi.value}</div>
              <div className="text-xs text-ink-faint">{kpi.caption}</div>
              {kpi.link && (
                <div className="mt-3 border-t border-border pt-2">
                  <SectionLink to={kpi.to}>{kpi.link}</SectionLink>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* My Actions */}
        <Card title="My Actions" action={<SectionLink>View All Actions</SectionLink>}>
          <div className="grid grid-cols-4 gap-3 xl:grid-cols-8">
            {actions.map((action) =>
              action.to ? (
                <Link
                  key={action.label}
                  to={action.to}
                  className="flex flex-col items-center gap-2 rounded-(--radius-card) border border-border p-3 text-center text-xs font-medium hover:border-primary hover:bg-primary-soft"
                >
                  <action.icon className="h-5 w-5 text-primary" />
                  {action.label}
                </Link>
              ) : (
                <button
                  key={action.label}
                  type="button"
                  className="flex flex-col items-center gap-2 rounded-(--radius-card) border border-border p-3 text-center text-xs font-medium hover:border-primary hover:bg-primary-soft"
                >
                  <action.icon className="h-5 w-5 text-primary" />
                  {action.label}
                </button>
              ),
            )}
          </div>
        </Card>

        {/* Tasks / Announcements / My Day */}
        <div className="grid gap-4 xl:grid-cols-3">
          <Card title="My Tasks" action={<SectionLink />}>
            <ul className="space-y-3">
              {tasks.map((task) => (
                <li key={task.title} className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-medium">{task.title}</div>
                    <div className="text-xs text-ink-faint">{task.due}</div>
                  </div>
                  <Badge tone={task.tone}>{task.chip}</Badge>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Announcements" action={<SectionLink to="/communications" />}>
            <ul className="space-y-3">
              {announcements.data?.slice(0, 5).map((item) => (
                <li key={item.id}>
                  <div className="flex items-center gap-2">
                    <Badge tone="primary">{item.category}</Badge>
                    <span className="font-medium">{item.title}</span>
                  </div>
                  <div className="mt-0.5 text-xs text-ink-faint">
                    {item.publishedAt && new Date(item.publishedAt).toLocaleDateString("en-IN")}
                  </div>
                </li>
              ))}
              {announcements.data?.length === 0 && <p className="text-ink-muted">No announcements yet.</p>}
            </ul>
          </Card>

          <Card title="My Day" action={<SectionLink>View Full Calendar</SectionLink>}>
            <ul className="space-y-3">
              {myDay.map((slot) => (
                <li key={slot.time} className="flex gap-3">
                  <span className="w-16 shrink-0 text-xs font-medium text-ink-muted">
                    {slot.time}
                  </span>
                  <div className="border-l-2 border-primary pl-3">
                    <div className="font-medium">{slot.title}</div>
                    <div className="text-xs text-ink-faint">{slot.detail}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Bottom row */}
        <div className="grid gap-4 xl:grid-cols-3">
          <Card title="My Goals" action={<SectionLink to="/goals" />}>
            {activeGoals.length === 0 && <p className="text-ink-muted">No active goals — add one on the Goals page.</p>}
            <ul className="space-y-4">
              {activeGoals.map((goal) => (
                <li key={goal.id}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="font-medium">{goal.title}</span>
                    <span className="text-ink-faint">{goal.progress}%</span>
                  </div>
                  <ProgressBar value={goal.progress} />
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Who's Out" action={<SectionLink />}>
            <ul className="space-y-3">
              {whosOut.map((person) => (
                <li key={person.name} className="flex items-center gap-3">
                  <Avatar name={person.name} size="sm" />
                  <span className="flex-1 font-medium">{person.name}</span>
                  <span className="text-xs text-ink-faint">{person.range}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Upcoming Events" action={<SectionLink>View Calendar</SectionLink>}>
            <ul className="space-y-3">
              {events.map((event) => (
                <li key={event.title} className="flex items-center gap-3">
                  <span className="flex h-10 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-primary-soft text-[10px] font-bold leading-tight text-primary">
                    {event.date.split(" ")[0]}
                    <span className="text-sm">{event.date.split(" ")[1]}</span>
                  </span>
                  <div>
                    <div className="font-medium">{event.title}</div>
                    <div className="text-xs text-ink-faint">{event.detail}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      {/* Right rail — AI assistant + team, per board T-001 */}
      <aside className="hidden w-80 shrink-0 space-y-4 min-[1400px]:block">
        <RidzAssistantCard firstName={firstName} />

        <Card title="My Team (8)" action={<SectionLink />}>
          <ul className="space-y-3">
            {team.map((member) => (
              <li key={member.name} className="flex items-center gap-3">
                <Avatar name={member.name} />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{member.name}</div>
                  <div className="truncate text-xs text-ink-faint">{member.role}</div>
                </div>
                <Badge tone={member.tone}>{member.status}</Badge>
              </li>
            ))}
          </ul>
          <Link
            to="/team"
            className="mt-4 flex w-full items-center justify-between rounded-lg border border-border px-3 py-2 font-medium hover:border-primary"
          >
            Go to My Team <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>
      </aside>
    </div>
  );
}
