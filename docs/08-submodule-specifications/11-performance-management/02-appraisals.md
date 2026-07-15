---
id: HRMS-SUB-11-02
title: Appraisals Specification
document: 02-appraisals.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Appraisals governs the formal review process used to evaluate employee performance for a defined cycle and derive ratings, development actions, compensation inputs, and management decisions.

In scope:

- Self, manager, skip-level, and committee review flows
- Rating models and summary narratives
- Performance evidence aggregation
- Finalization, acknowledgment, and closure
- Integration to compensation, succession, and learning modules

# 2. Business

Appraisals provide the organization with a repeatable mechanism for recognizing performance, managing underperformance, and informing compensation and talent decisions.

Business outcomes:

- Standardize end-of-cycle evaluation quality
- Improve fairness and traceability of ratings
- Convert performance outcomes into action for rewards and development
- Support executive visibility into workforce contribution

# 3. Functional

The system shall support:

- Appraisal cycles by legal entity, business unit, population, or grade
- Role-specific forms combining goals, competencies, values, and custom sections
- Self-appraisal, manager review, skip-level review, and HR moderation
- Weighted scoring and manual rating recommendations with calibration readiness
- Narrative sections for achievements, challenges, development needs, and role changes
- Attachments and evidence pulled from goals, projects, recognition, or disciplinary records where allowed
- Acknowledgment, dispute submission, and closure controls
- Improvement plans and development commitments linked from appraisal outcomes

Validation rules:

- Appraisal cannot finalize without mandatory sections complete
- Rating scales and weights shall be frozen once the cycle enters review mode
- Compensation trigger export shall use only finalized and approved records
- Acknowledgment can be optional or mandatory by policy

# 4. UX

The user experience shall provide:

- Stepwise appraisal form with progress indicator and autosave
- Summary panel showing goals, feedback, recognition, and prior-cycle context
- Manager dashboard for team completion status, overdue reviews, and flagged cases
- Review comparison view for large teams
- Employee view showing submitted content, manager comments, and acknowledgment tasks

# 5. API

Representative APIs:

- `POST /api/v1/performance/appraisals`
- `PATCH /api/v1/performance/appraisals/{appraisalId}`
- `POST /api/v1/performance/appraisals/{appraisalId}/submit`
- `POST /api/v1/performance/appraisals/{appraisalId}/finalize`
- `POST /api/v1/performance/appraisals/{appraisalId}/acknowledge`
- `GET /api/v1/performance/cycles/{cycleId}/appraisals`

API requirements:

- Appraisal APIs shall enforce cycle phase and mandatory section rules
- Draft responses shall preserve section-level save state
- Export APIs shall include rating lineage and calibration adjustments

# 6. Database

Core entities:

- `appraisal_cycle`
- `appraisal_record`
- `appraisal_section`
- `appraisal_rating`
- `appraisal_comment`
- `appraisal_acknowledgment`
- `appraisal_dispute`

Key data requirements:

- Appraisal records shall store employee, reviewer chain, cycle, rating model, and final decision
- Section records shall capture score, narrative, completion status, and visibility rules
- Dispute records shall store grounds, evidence, reviewer resolution, and outcome

# 7. Events

The platform shall publish:

- `appraisal.created`
- `appraisal.self-submitted`
- `appraisal.manager-submitted`
- `appraisal.finalized`
- `appraisal.acknowledged`
- `appraisal.dispute-raised`

# 8. Reports

Required reports:

- Appraisal completion by cycle and hierarchy
- Rating distribution report
- Underperformance and top-talent trend report
- Acknowledgment and dispute analysis
- Manager timeliness report

# 9. Dashboards

Dashboards shall show:

- Cycle completion status by review stage
- Rating spread by business unit and grade
- Overdue reviewers and bottleneck teams
- Linkage between appraisal outcome and compensation planning readiness

# 10. Security

Security controls shall include:

- Confidential access boundaries for reviewer comments and HR notes
- Controlled access to dispute evidence
- Prevention of unauthorized rating changes after finalization
- Encryption for appraisal narratives and attachments

# 11. Audit

The audit trail shall capture:

- Draft and final submissions
- Rating changes across reviewer stages
- Calibration-linked adjustments
- Acknowledgment, dispute, and resolution history

# 12. AI

AI capabilities may include:

- Draft summary generation from goals and evidence
- Detection of appraisal narratives lacking evidence or containing bias-prone language
- Suggested development themes mapped to learning catalog

AI guardrails:

- AI shall not assign final ratings automatically
- Users shall be able to review and edit generated summaries before submission

# 13. Test Cases

Minimum test coverage shall include:

- Missing mandatory section blocks submission
- Manager cannot finalize before self-review if policy requires it
- Finalized rating exports correctly to compensation cycle
- Acknowledgment task closes only after employee action
- Dispute submission creates separate resolution workflow

# 14. Workflows

Primary workflow:

1. Appraisal cycle opens.
2. Employee completes self-review.
3. Manager and optional skip-level reviewers evaluate.
4. Calibration or moderation adjusts where needed.
5. Final result is shared, acknowledged, and archived.

# 15. State Machine

Supported states:

- `draft`
- `self-submitted`
- `manager-review`
- `skip-review`
- `calibration`
- `finalized`
- `acknowledged`
- `disputed`
- `closed`

# 16. Permissions

Permissions shall include:

- Configure appraisal forms and cycles
- Submit self and manager reviews
- Finalize ratings
- View team or enterprise appraisal analytics
- Raise or resolve disputes
- Reopen finalized appraisals under controlled authority

# 17. Notifications

Notifications shall support:

- Cycle launch announcements
- Pending self-review and manager-review reminders
- Final result publication notices
- Acknowledgment and dispute deadlines
- HR alerts for unresolved overdue reviews

# 18. Configuration

Administrators shall configure:

- Review phases and actor sequence
- Rating scales, labels, and forced logic if any
- Form sections and mandatory evidence rules
- Acknowledgment and dispute policies
- Integration triggers to compensation and talent systems

# 19. Edge Cases

The design shall address:

- Employee exits before cycle finalization
- Manager changes during review phase
- Employee on long leave during self-review window
- Appraisal spans multiple concurrent roles or matrix managers
- Retroactive correction required after compensation already consumed ratings
