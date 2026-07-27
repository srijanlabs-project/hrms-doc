import { useAuth } from "../auth/AuthProvider";
import { BookingPanel } from "./BookingPanel";
import { ResourceAdminPanel } from "./ResourceAdminPanel";
import { VisitorAdminPanel } from "./VisitorAdminPanel";
import { VisitorPanel } from "./VisitorPanel";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/**
 * Wave 4 W4·E21 Visitor and Workplace Management, built from scratch —
 * 21-visitor-workplace-management.md. Visitor registration doubles as the
 * gate pass (one state-machine entity, no separate row); desk/room/parking/
 * shuttle/cafeteria collapse into one generic resource + booking pair.
 */
export function WorkplaceHubPage() {
  const { user } = useAuth();
  const isAdmin = ADMIN_ROLES.some((role) => user?.roles.includes(role));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Workplace</h1>
        <p className="text-ink-muted">Register visitors and book desks, rooms, parking, shuttle, or cafeteria seats.</p>
      </header>

      <VisitorPanel />
      {isAdmin && <VisitorAdminPanel />}
      <BookingPanel />
      {isAdmin && <ResourceAdminPanel />}
    </div>
  );
}
