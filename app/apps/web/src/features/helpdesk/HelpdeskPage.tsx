import { useAuth } from "../auth/AuthProvider";
import { KnowledgeBasePanel } from "./KnowledgeBasePanel";
import { MyTicketsPanel } from "./MyTicketsPanel";
import { TicketQueuePanel } from "./TicketQueuePanel";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/**
 * Helpdesk and Case Management — docs/03-module-specifications/19-helpdesk-case-management.md.
 * v1: tickets (+comments, SLA due dates, nightly escalation sweep) and a
 * knowledge base. HR/IT/Admin/Finance collapse into one queue-tagged ticket
 * model; Service Agent/Queue Manager collapse to org_admin/hr_ops. Employee
 * relations and grievance management stays deferred — see
 * schema.prisma's Ticket comment for why.
 */
export function HelpdeskPage() {
  const { user } = useAuth();
  const isAdmin = ADMIN_ROLES.some((role) => user?.roles.includes(role));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Helpdesk</h1>
        <p className="text-ink-muted">Raise tickets for HR, IT, Admin, or Finance and track them through resolution.</p>
      </header>

      <MyTicketsPanel />
      <KnowledgeBasePanel isAdmin={isAdmin} />
      {isAdmin && <TicketQueuePanel />}
    </div>
  );
}
