---
id: HRMS-SUB-13-02
title: Talent reviews Specification
document: 02-talent-reviews.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Talent Reviews governs structured leadership reviews of employee potential, performance trajectory, risk, mobility, and development priority to support strategic talent decisions.

In scope:

- Talent review cycle planning
- Calibration and matrix placement
- Potential and risk assessment
- Development and retention action tracking
- Leadership review outputs and auditability

# 2. Business

Talent reviews help organizations identify future leaders, critical talent risks, underutilized employees, and development priorities. Without a governed process, assessments become subjective, inconsistent, and difficult to translate into action.

Business objectives:

- Create a repeatable, calibrated view of talent across the enterprise
- Improve consistency of potential and risk assessments
- Support promotion, succession, development, and retention decisions
- Produce leadership-quality visibility into talent pipeline health

# 3. Functional

The system shall support:

- Review cycles by company, function, leadership level, or geography
- Talent discussion records at individual and team levels
- 9-box or configurable talent matrix placement
- Potential, performance trajectory, mobility, retention risk, and critical-skill indicators
- Calibration sessions across managers and business leaders
- Development and retention action capture linked to outcomes
- Restricted confidentiality controls for sensitive discussions

Detailed rules:

- Talent-review outcomes should be versioned by cycle and not overwritten after finalization
- Calibration changes must preserve original manager input and final calibrated outcome
- Matrix definitions should be configurable but centrally governed
- Promotion or succession use of review outputs should be traceable but not automatic
- Discussion notes may be more sensitive than performance data and require stronger visibility control
- Review cohorts should support forced-distribution guidance only where policy allows, not as a hidden hard rule
- Action planning should distinguish development, retention, mobility, and succession follow-up types

# 4. UX

Primary screens:

- Talent review roster
- Calibration matrix workspace
- Individual talent profile
- Action planning board
- Executive talent summary dashboard

UX expectations:

- Reviewers should compare talent signals side by side across teams
- Calibration boards should support rapid movement with visible impact history
- Executive views should summarize distributions and risks without exposing more detail than necessary

# 5. API

Representative APIs:

- `POST /api/v1/talent/reviews/cycles`
- `POST /api/v1/talent/reviews/cycles/{cycleId}/participants`
- `POST /api/v1/talent/reviews/cycles/{cycleId}/calibrate`
- `POST /api/v1/talent/reviews/cycles/{cycleId}/finalize`
- `GET /api/v1/talent/reviews/cycles/{cycleId}/matrix`
- `POST /api/v1/talent/reviews/actions`

# 6. Database

Core entities:

- `talent_review_cycle`
- `talent_review_participant`
- `talent_review_assessment`
- `talent_review_calibration_change`
- `talent_review_action`
- `talent_review_confidential_note`

Key fields:

- Cycle name, scope, owner, status, review date range
- Employee ID, manager, reviewer, proposed placement, final placement
- Potential rating, performance trend, mobility, retention risk, confidence level
- Calibration source, changed by, changed from, changed to, reason
- Action type, owner, target date, progress status
- Confidential note sensitivity class and restricted-audience flag
- Discussion timestamp and panel composition metadata

# 7. Events

Published events:

- `talent_review.cycle_created`
- `talent_review.assessment_submitted`
- `talent_review.calibrated`
- `talent_review.finalized`
- `talent_review.action_created`

Consumed events:

- `performance.review_completed`
- `succession.review_finalized`
- `learning.plan_completed`
- `employee.transfer.completed`

# 8. Reports

Required reports:

- Talent distribution report
- 9-box placement report
- Mobility and retention risk report
- Calibration change report
- Action completion report
- High-potential diversity and representation report
- Critical-talent loss-risk report

# 9. Dashboards

Operational dashboards:

- Talent distribution by business unit
- High-potential and high-risk populations
- Calibration variance by manager cohort
- Open retention or development actions

# 10. Security

Security requirements:

- Talent-review data is confidential and should be restricted to authorized HR and leadership roles
- Sensitive notes and retention-risk labels require additional access segmentation
- Export of review content should be tightly controlled

# 11. Audit

Audit coverage shall include:

- Assessment submission and edits
- Calibration changes and rationale
- Finalization of review cycle
- Access to confidential notes
- Action creation and closure

# 12. AI

AI-assisted opportunities:

- Summarize talent themes across large populations
- Highlight inconsistent calibration patterns or outlier ratings
- Suggest action priorities from talent-risk combinations

AI guardrails:

- AI should not auto-rank employees into confidential talent categories without human review
- Sensitive commentary should remain excluded from generalized summaries unless viewer is authorized

# 13. Test Cases

Core test scenarios:

- Create talent review cycle and roster
- Place employee in matrix and calibrate outcome
- Finalize cycle with preserved original and calibrated values
- Restrict confidential note access
- Create development action from review outcome
- Detect unauthorized cross-business visibility attempt
- Preserve cycle snapshot after employee transfer mid-cycle

# 14. Workflows

Primary workflow:

1. HR launches talent review cycle.
2. Managers submit assessments.
3. Calibration sessions adjust placements and risk views.
4. Cycle is finalized.
5. Development, promotion, succession, or retention actions are tracked.

# 15. State Machine

Cycle state model:

- `Draft`
- `Open`
- `Calibrating`
- `Finalized`
- `Archived`

# 16. Permissions

Representative permissions:

- `talent_review_cycle.manage`
- `talent_review_assessment.submit`
- `talent_review_calibration.edit`
- `talent_review_confidential.view`
- `talent_review_action.manage`
- `talent_review_audit.view`

# 17. Notifications

Notification scenarios:

- Review input due
- Calibration session scheduled
- Cycle finalized
- Action owner assigned
- Confidential review access granted or revoked

# 18. Configuration

Configurable parameters:

- Matrix model
- Review cadence
- Scope dimensions
- Confidentiality rules
- Action taxonomy

# 19. Edge Cases

Important edge cases:

- Employee changes manager during review cycle
- Performance data arrives late after assessment submission
- Calibration reverses a placement more than once in same session
- Leader needs restricted view for cross-business comparison
