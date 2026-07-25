import { useAuth } from "../auth/AuthProvider";
import { MySurveysPanel } from "./MySurveysPanel";
import { RecognitionPanel } from "./RecognitionPanel";
import { SurveyAdminPanel } from "./SurveyAdminPanel";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/**
 * Employee Experience — docs/03-module-specifications/15-employee-experience.md.
 * v1: surveys (incl. pulse, type-tagged) and peer recognition only. Social
 * feed, communities, events, wellness programs, the quote/culture library,
 * and AI-generated celebration cards all stay deferred — see
 * schema.prisma's Survey/Recognition comments for why.
 */
export function ExperiencePage() {
  const { user } = useAuth();
  const isAdmin = ADMIN_ROLES.some((role) => user?.roles.includes(role));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Employee Experience</h1>
        <p className="text-ink-muted">Recognize your peers and share your voice in company surveys.</p>
      </header>

      <RecognitionPanel />
      <MySurveysPanel />
      {isAdmin && <SurveyAdminPanel />}
    </div>
  );
}
