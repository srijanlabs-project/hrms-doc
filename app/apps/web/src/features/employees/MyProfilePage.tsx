import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

/**
 * W1·E04 Employee Self Service "personal profile" — the underlying
 * self-service permission checks (personal info, identity/finance,
 * documents, career, timeline) were already built in the People Management
 * deepening pass; this route was the missing entry point. Redirects to the
 * same 360° workspace admins use, since EmployeeService.get() and every
 * people-extras endpoint already allow an employee to read/edit their own
 * record.
 */
export function MyProfilePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <p className="text-ink-muted">Loading…</p>;
  }
  if (!user?.employeeId) {
    return <p className="text-negative">Your account is not linked to an employee record.</p>;
  }

  return <Navigate to={`/people/employees/${user.employeeId}`} replace />;
}
