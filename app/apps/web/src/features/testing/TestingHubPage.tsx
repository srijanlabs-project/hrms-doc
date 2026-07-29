import { useAuth } from "../auth/AuthProvider";
import { TestDataPanel } from "./TestDataPanel";
import { TestRunListPanel } from "./TestRunListPanel";
import { TestSuiteListPanel } from "./TestSuiteListPanel";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/**
 * W5·E32 Testing and Quality gap closure. Test data management reuses the
 * existing Import Engine (E31) directly. Regression/Performance/Security/
 * Accessibility/UAT collapse into one type-tagged suite/case/run/result
 * engine — live load-generation and automated SAST/DAST/axe-core scanning
 * stay deferred, since neither has dedicated tooling in this build.
 */
export function TestingHubPage() {
  const { user } = useAuth();
  const isAdmin = ADMIN_ROLES.some((role) => user?.roles.includes(role));

  if (!isAdmin) {
    return (
      <div className="rounded-(--radius-card) border border-border bg-surface p-8 text-center text-ink-muted">
        Testing and Quality is restricted to HR Operations and Org Admin roles.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Testing &amp; Quality</h1>
        <p className="text-ink-muted">
          Generate test data, plan test suites across regression/performance/security/accessibility/UAT, execute runs, and
          record sign-off decisions.
        </p>
      </header>

      <TestDataPanel />
      <TestSuiteListPanel />
      <TestRunListPanel />
    </div>
  );
}
