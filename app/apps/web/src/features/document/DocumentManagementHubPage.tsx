import { useAuth } from "../auth/AuthProvider";
import { DocumentAdminPanel } from "./DocumentAdminPanel";
import { DocumentRepositoryPanel } from "./DocumentRepositoryPanel";
import { RetentionPolicyAdminPanel } from "./RetentionPolicyAdminPanel";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/**
 * Wave 4 W4·E24 Document Management, docs/03-module-specifications/24-document-management.md.
 * Templates and generation already existed (Foundation & Platform E00's
 * DocumentTemplate/GeneratedDocument); this page covers the remaining real
 * gap — a versioned, retention-governed document repository. Digital
 * signatures and OCR stay deliberately deferred — no vendor exists in this
 * environment to integrate against.
 */
export function DocumentManagementHubPage() {
  const { user } = useAuth();
  const isAdmin = ADMIN_ROLES.some((role) => user?.roles.includes(role));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Documents</h1>
        <p className="text-ink-muted">View your documents and organization-wide policies.</p>
      </header>

      <DocumentRepositoryPanel />
      {isAdmin && <DocumentAdminPanel />}
      {isAdmin && <RetentionPolicyAdminPanel />}
    </div>
  );
}
