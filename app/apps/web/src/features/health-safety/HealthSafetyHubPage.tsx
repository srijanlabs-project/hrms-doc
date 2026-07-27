import { useAuth } from "../auth/AuthProvider";
import { EmergencyContactAdminPanel } from "./EmergencyContactAdminPanel";
import { EmergencyContactPanel } from "./EmergencyContactPanel";
import { HealthRecordPanel } from "./HealthRecordPanel";
import { SafetyAssessmentPanel } from "./SafetyAssessmentPanel";
import { SafetyIncidentAdminPanel } from "./SafetyIncidentAdminPanel";
import { SafetyIncidentPanel } from "./SafetyIncidentPanel";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/**
 * Wave 4 W4·E22 Health Safety and Wellness, built from scratch —
 * 22-health-safety-wellness.md. Incident reporting collapses spec's
 * ActionAssigned state into UnderReview's investigationNotes field; safety
 * assessments collapse audits/risk-assessments/drills into one type-tagged
 * entity; health records mirror CertificationRecord's flat-catalog shape.
 * PPE tracking reuses Asset Management's category field rather than a new
 * entity — see Assets Hub.
 */
export function HealthSafetyHubPage() {
  const { user } = useAuth();
  const isAdmin = ADMIN_ROLES.some((role) => user?.roles.includes(role));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Health, Safety and Wellness</h1>
        <p className="text-ink-muted">
          Report safety incidents, track health records, and find emergency contacts.
        </p>
      </header>

      <SafetyIncidentPanel />
      {isAdmin && <SafetyIncidentAdminPanel />}
      <HealthRecordPanel />
      {isAdmin && <SafetyAssessmentPanel />}
      <EmergencyContactPanel />
      {isAdmin && <EmergencyContactAdminPanel />}
    </div>
  );
}
