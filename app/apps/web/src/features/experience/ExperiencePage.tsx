import { useAuth } from "../auth/AuthProvider";
import { CommunitiesPanel } from "./CommunitiesPanel";
import { EventsAdminPanel } from "./EventsAdminPanel";
import { EventsPanel } from "./EventsPanel";
import { FeedPanel } from "./FeedPanel";
import { MySurveysPanel } from "./MySurveysPanel";
import { RecognitionPanel } from "./RecognitionPanel";
import { RewardsAdminPanel } from "./RewardsAdminPanel";
import { RewardsPanel } from "./RewardsPanel";
import { SurveyAdminPanel } from "./SurveyAdminPanel";
import { WellnessAdminPanel } from "./WellnessAdminPanel";
import { WellnessPanel } from "./WellnessPanel";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/**
 * Employee Experience — docs/03-module-specifications/15-employee-experience.md.
 * v1: surveys (incl. pulse, type-tagged) and peer recognition. Deepened per
 * Wave 3 gap closure with rewards (a redemption catalog behind Recognition's
 * points), a text-only social feed, communities, events, and wellness
 * programs. AI celebration cards and the quote/culture library stay
 * deferred — see schema.prisma's model comments for why.
 */
export function ExperiencePage() {
  const { user } = useAuth();
  const isAdmin = ADMIN_ROLES.some((role) => user?.roles.includes(role));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Employee Experience</h1>
        <p className="text-ink-muted">Recognize your peers, join in, and share your voice.</p>
      </header>

      <RecognitionPanel />
      <RewardsPanel />
      {isAdmin && <RewardsAdminPanel />}
      <MySurveysPanel />
      {isAdmin && <SurveyAdminPanel />}
      <FeedPanel />
      <CommunitiesPanel />
      <EventsPanel />
      {isAdmin && <EventsAdminPanel />}
      <WellnessPanel />
      {isAdmin && <WellnessAdminPanel />}
    </div>
  );
}
