import {
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  FileText,
  Home,
  IndianRupee,
  LayoutGrid,
  Receipt,
  Send,
  Settings2,
  Sparkles,
  Upload,
} from "lucide-react";
import type { ReactNode } from "react";
import { Avatar } from "../components/ui/Avatar";
import { Badge, type BadgeTone } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { ProgressBar } from "../components/ui/ProgressBar";

/**
 * T-001 My Staffsy Workspace — employee landing page.
 * Structure mirrors board T001.png: greeting header, KPI row, My Actions,
 * My Tasks / Announcements / My Day, AI assistant + team right rail, and the
 * schedule/goals/who's-out bottom row. Data is placeholder until the People,
 * Leave, and Workflow services land.
 */

const kpis = [
  { label: "Leave Balance", value: "18.5", caption: "Days Available", link: "View Details" },
  { label: "Attendance", value: "100%", caption: "This Month", link: "View Details" },
  { label: "Pending Tasks", value: "6", caption: "Tasks", link: "View All" },
  { label: "Requests", value: "4", caption: "Open Requests", link: "View All" },
  { label: "Payslip", value: "₹78,500", caption: "June 2026", link: "View Payslip" },
];

const actions = [
  { label: "Apply Leave", icon: CalendarDays },
  { label: "Mark Attendance", icon: CalendarCheck },
  { label: "My Requests", icon: FileText },
  { label: "View Payslip", icon: IndianRupee },
  { label: "Claim Expense", icon: Receipt },
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

const announcements = [
  { title: "Flexible Work Policy Update", meta: "Effective from 1st Aug · 2 hours ago", chip: "New" },
  { title: "Townhall with Leadership Team", meta: "5th Aug at 4:00 PM · 1 day ago", chip: null },
  { title: "Independence Day Celebration", meta: "15th Aug · Office Holiday · 2 days ago", chip: null },
];

const myDay = [
  { time: "09:30 AM", title: "Team Standup", detail: "30 mins" },
  { time: "11:00 AM", title: "Product Roadmap Review", detail: "1 hr" },
  { time: "02:00 PM", title: "1:1 with Manager", detail: "30 mins" },
  { time: "04:00 PM", title: "Learning: Leadership 101", detail: "45 mins" },
];

const aiSuggestions = [
  "Show my pending tasks",
  "Apply for leave",
  "When is my next holiday?",
  "Show my team attendance",
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

const goals = [
  { label: "Improve Design System", value: 75, tone: "primary" as const },
  { label: "Enhance User Research", value: 60, tone: "accent" as const },
  { label: "Mentor Team Members", value: 40, tone: "info" as const },
];

const whosOut = [
  { name: "Sneha Iyer", range: "16 – 18 Jul" },
  { name: "Karan Shah", range: "16 Jul" },
  { name: "Ananya Kapoor", range: "17 – 19 Jul" },
];

function SectionLink({ children = "View All" }: { children?: ReactNode }) {
  return (
    <button type="button" className="flex items-center gap-1 text-xs font-medium text-primary">
      {children} <ArrowRight className="h-3 w-3" />
    </button>
  );
}

export function MyStaffsyPage() {
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
            <h1 className="text-2xl font-bold">Good morning, Rahul! 👋</h1>
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
              <div className="mt-3 border-t border-border pt-2">
                <SectionLink>{kpi.link}</SectionLink>
              </div>
            </div>
          ))}
        </div>

        {/* My Actions */}
        <Card title="My Actions" action={<SectionLink>View All Actions</SectionLink>}>
          <div className="grid grid-cols-4 gap-3 xl:grid-cols-8">
            {actions.map((action) => (
              <button
                key={action.label}
                type="button"
                className="flex flex-col items-center gap-2 rounded-(--radius-card) border border-border p-3 text-center text-xs font-medium hover:border-primary hover:bg-primary-soft"
              >
                <action.icon className="h-5 w-5 text-primary" />
                {action.label}
              </button>
            ))}
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

          <Card title="Announcements" action={<SectionLink />}>
            <ul className="space-y-3">
              {announcements.map((item) => (
                <li key={item.title}>
                  <div className="flex items-center gap-2">
                    {item.chip && <Badge tone="primary">{item.chip}</Badge>}
                    <span className="font-medium">{item.title}</span>
                  </div>
                  <div className="mt-0.5 text-xs text-ink-faint">{item.meta}</div>
                </li>
              ))}
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
          <Card title="My Goals" action={<SectionLink />}>
            <ul className="space-y-4">
              {goals.map((goal) => (
                <li key={goal.label}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="font-medium">{goal.label}</span>
                    <span className="text-ink-faint">{goal.value}%</span>
                  </div>
                  <ProgressBar value={goal.value} tone={goal.tone} />
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
        <Card>
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-semibold">Ridz</span>
            <Badge tone="primary">BETA</Badge>
          </div>
          <p className="mb-3 text-ink-muted">Hi Rahul! I'm Ridz — how can I help you today?</p>
          <div className="space-y-2">
            {aiSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className="block w-full rounded-lg border border-border px-3 py-2 text-left hover:border-primary hover:bg-primary-soft"
              >
                {suggestion}
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-border px-3 py-2">
            <input
              className="w-full bg-transparent outline-none placeholder:text-ink-faint"
              placeholder="Ask Ridz anything about HR…"
            />
            <Send className="h-4 w-4 shrink-0 text-primary" />
          </div>
        </Card>

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
          <button
            type="button"
            className="mt-4 flex w-full items-center justify-between rounded-lg border border-border px-3 py-2 font-medium hover:border-primary"
          >
            Go to My Team <ArrowRight className="h-4 w-4" />
          </button>
        </Card>
      </aside>
    </div>
  );
}
