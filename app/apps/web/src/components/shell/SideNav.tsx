import { NavLink } from "react-router-dom";

type NavItem = { label: string; to: string; disabled?: boolean };
type NavSection = { title: string; items: NavItem[] };

/**
 * Navigation structure follows the MY WORK / GROWTH / RESOURCES grouping on
 * board T-001. Disabled entries are registered destinations whose modules are
 * not built yet — they render as inert placeholders so the information
 * architecture stays visible from day one.
 */
const sections: NavSection[] = [
  {
    title: "My Work",
    items: [
      { label: "Home", to: "/home" },
      { label: "My Profile", to: "/profile", disabled: true },
      { label: "Attendance", to: "/attendance", disabled: true },
      { label: "Leave", to: "/leave", disabled: true },
      { label: "My Requests", to: "/requests", disabled: true },
    ],
  },
  {
    title: "Organization",
    items: [
      { label: "People", to: "/people", disabled: true },
      { label: "Org Structure", to: "/org", disabled: true },
      { label: "Approvals", to: "/approvals", disabled: true },
    ],
  },
];

export function SideNav() {
  return (
    <nav className="w-(--spacing-sidebar) shrink-0 border-r border-border bg-surface px-3 py-6">
      {sections.map((section) => (
        <div key={section.title} className="mb-6">
          <div className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">
            {section.title}
          </div>
          <ul className="space-y-1">
            {section.items.map((item) =>
              item.disabled ? (
                <li
                  key={item.to}
                  className="cursor-not-allowed rounded-lg px-3 py-2 text-ink-faint"
                  title="Coming soon"
                >
                  {item.label}
                </li>
              ) : (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2 font-medium ${
                        isActive
                          ? "bg-primary text-white"
                          : "text-ink hover:bg-primary-soft hover:text-primary"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ),
            )}
          </ul>
        </div>
      ))}
    </nav>
  );
}
