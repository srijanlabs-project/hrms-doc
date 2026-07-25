import { Feedback360ManagePanel } from "./Feedback360ManagePanel";
import { Feedback360SelfPanel } from "./Feedback360SelfPanel";

/**
 * 360 Feedback — docs/08-submodule-specifications/11-performance-management/03-360-feedback.md.
 * v1: fixed rating+two-text-field questionnaire, no anonymity-threshold
 * enforcement or tokenized rater links. The manage panel is visible to
 * everyone; the backend restricts campaign management to the subject's
 * manager or org_admin/hr_ops and shows a clear error otherwise.
 */
export function Feedback360Page() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">360 Feedback</h1>
        <p className="text-ink-muted">Multi-source feedback from managers, peers, and direct reports.</p>
      </header>

      <Feedback360SelfPanel />
      <Feedback360ManagePanel />
    </div>
  );
}
