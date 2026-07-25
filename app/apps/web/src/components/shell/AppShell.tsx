import { Outlet } from "react-router-dom";
import { ExitPortalPage } from "../../features/auth/ExitPortalPage";
import { useAuth } from "../../features/auth/AuthProvider";
import { FooterBar } from "./FooterBar";
import { SideNav } from "./SideNav";
import { TopBar } from "./TopBar";

const RESTRICTED_STATUSES = ["Separated", "Archived"];

/**
 * Staffsy application shell — top command bar + fixed 240px sidebar + fluid
 * content area, per the shared layout spec on the template boards
 * (1440px max container, 12-column grid, 24px gutter). A Separated/Archived
 * employee never sees this shell at all, regardless of which route they hit
 * — the backend's ExitStatusGuard would 403 every API call the normal shell
 * makes anyway, so swapping the whole layout here avoids a shell full of
 * broken-looking cards.
 */
export function AppShell() {
  const { user } = useAuth();

  if (user && RESTRICTED_STATUSES.includes(user.employeeStatus ?? "")) {
    return <ExitPortalPage />;
  }

  return (
    <div className="min-h-screen">
      <TopBar />
      <div className="mx-auto flex max-w-(--container-shell)">
        <SideNav />
        <main className="min-w-0 flex-1 p-6">
          <Outlet />
          <FooterBar />
        </main>
      </div>
    </div>
  );
}
