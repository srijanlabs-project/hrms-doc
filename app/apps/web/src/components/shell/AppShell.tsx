import { Outlet } from "react-router-dom";
import { FooterBar } from "./FooterBar";
import { SideNav } from "./SideNav";
import { TopBar } from "./TopBar";

/**
 * Staffsy application shell — top command bar + fixed 240px sidebar + fluid
 * content area, per the shared layout spec on the template boards
 * (1440px max container, 12-column grid, 24px gutter).
 */
export function AppShell() {
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
