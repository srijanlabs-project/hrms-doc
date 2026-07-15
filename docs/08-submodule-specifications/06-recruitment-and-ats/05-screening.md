---
id: HRMS-SUB-06-05
title: Screening Specification
document: 05-screening.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Screening governs the structured evaluation of applicants before formal interviews so recruiters and hiring teams can prioritize qualified candidates, remove non-viable profiles early, and preserve fairness.

In scope:

- Resume parsing and profile normalization
- Knockout criteria, eligibility, and duplicate checks
- Recruiter review, shortlist, reject, hold, and pipeline movement
- Pre-screen questionnaires, assessments, and telephonic screening
- Candidate ranking and stage readiness controls

# 2. Business

Screening is the first quality gate in the recruitment lifecycle. It reduces time spent by hiring managers on unsuitable profiles, improves candidate turnaround time, and ensures that hiring decisions begin from a transparent and auditable baseline.

Business outcomes:

- Reduce recruiter effort per hire through automated and guided filtering
- Improve shortlist quality for business stakeholders
- Standardize early-stage decision criteria across recruiters and locations
- Detect disqualifiers, fraud indicators, and duplicate applicants quickly

# 3. Functional

The system shall support:

- Automated profile ingestion from portal, referral, agency, and job-board sources
- Configurable mandatory eligibility rules such as location, notice period, work authorization, experience, qualification, and compensation range
- Resume parsing, skill extraction, and profile enrichment without overwriting candidate-entered data blindly
- Recruiter screening queues by requisition, source, priority, and SLA
- Candidate states such as new, under review, shortlisted, rejected, on hold, assessment pending, and ready for interview
- Pre-screen questionnaires with mandatory, optional, weighted, and knockout questions
- Integration with assessment vendors and internal tests
- Duplicate detection using email, phone, government identifier, resume similarity, and previous employee records
- Bulk actions for reject, hold, tag, assign recruiter, move stage, and send communication
- Reason-code capture for rejection, hold, or insufficient information
- Policy controls for internal applicants, rehired employees, and referred candidates

Validation rules:

- A candidate cannot move to interview scheduling unless required screening artifacts are complete
- Knockout failures shall require an explicit override permission before stage advancement
- Screening notes can be edited only until the candidate is moved to the next stage unless reopened
- Duplicate profiles shall be merged or dispositioned before requisition progression

# 4. UX

The user experience shall provide:

- Recruiter workbench with side-by-side resume, parsed profile, requisition fit summary, and candidate timeline
- Visual indicators for knockout failures, missing data, duplicate warnings, and source quality
- Fast keyboard-friendly actions for shortlist, reject, hold, and assign
- Comparison mode for multiple candidates against the same requisition
- Candidate screening form that separates objective criteria from subjective notes
- Mobile-responsive recruiter views for urgent review and approvals

Accessibility and usability expectations:

- Color alone shall not communicate fit or risk
- Long resumes shall support section navigation and search
- Time-consuming assessments shall show progress and retry guidance

# 5. API

Representative APIs:

- `POST /api/v1/recruitment/candidates/{candidateId}/screening`
- `PATCH /api/v1/recruitment/candidates/{candidateId}/screening`
- `POST /api/v1/recruitment/candidates/{candidateId}/assessments`
- `GET /api/v1/recruitment/requisitions/{requisitionId}/screening-queue`
- `POST /api/v1/recruitment/candidates/duplicate-resolution`
- `POST /api/v1/recruitment/candidates/{candidateId}/stage-transition`

API requirements:

- Screening APIs shall return policy failures with machine-readable codes
- Resume parsing callbacks shall be idempotent and trace source document versions
- Assessment result ingestion shall preserve raw vendor payloads for audit

# 6. Database

Core entities:

- `candidate`
- `candidate_profile`
- `candidate_application`
- `screening_decision`
- `screening_questionnaire_response`
- `screening_assessment`
- `candidate_duplicate_case`
- `stage_transition_log`

Key data requirements:

- Screening decision records shall store decision type, evaluator, timestamp, score, rationale, and override flag
- Assessment records shall capture vendor, test package, attempt, result, percentile, and expiration date
- Duplicate cases shall store match algorithm, confidence score, and chosen resolution

# 7. Events

The platform shall publish:

- `candidate.screening.started`
- `candidate.screening.completed`
- `candidate.screening.shortlisted`
- `candidate.screening.rejected`
- `candidate.assessment.requested`
- `candidate.assessment.completed`
- `candidate.duplicate.detected`

Subscribers may include analytics, communication, interview scheduling, and compliance services.

# 8. Reports

Required reports:

- Screening funnel by requisition, recruiter, location, and source
- Rejection reason analysis
- Assessment conversion and pass-rate report
- Duplicate applicant report
- Recruiter SLA and workload report

# 9. Dashboards

Dashboards shall show:

- Open screening queue volume and aging
- Shortlist yield by requisition and recruiter
- Source-wise screening quality
- Assessment turnaround and dropout trend

# 10. Security

Security controls shall include:

- Field-level masking for protected personal data
- Restricted visibility of government identifiers and assessment raw payloads
- Segregation between recruiter, hiring manager, and vendor users
- Anti-bias controls that limit visibility of protected attributes where jurisdiction requires

# 11. Audit

The audit trail shall capture:

- Every screening decision and stage movement
- Override of knockout or assessment failures
- Resume replacements, duplicate merges, and profile edits
- Assessment imports, recalculations, and vendor callback failures

# 12. AI

AI capabilities may include:

- Fit scoring based on requisition criteria and historical hiring patterns
- Resume summarization with explicit confidence indicators
- Suggested screening questions and risk signals
- Duplicate detection enhancement through semantic similarity

AI guardrails:

- AI output shall be advisory, not final decisioning
- Explanations shall identify which data points influenced the recommendation
- Protected characteristics shall never be used for fit scoring

# 13. Test Cases

Minimum test coverage shall include:

- Candidate fails knockout criteria and cannot proceed without override
- Duplicate candidate detected across multiple sources
- Assessment callback updates candidate status correctly
- Bulk shortlist and reject actions update queue metrics
- Recruiter notes remain immutable after next-stage progression unless reopened

# 14. Workflows

Primary workflow:

1. Candidate enters requisition pipeline.
2. System runs parsing, duplicate checks, and eligibility validation.
3. Recruiter reviews profile and questionnaire or assessment outputs.
4. Candidate is shortlisted, rejected, held, or routed for more evidence.
5. Shortlisted candidate becomes eligible for interview scheduling.

# 15. State Machine

Supported states:

- `new`
- `awaiting-parse`
- `awaiting-assessment`
- `under-screening`
- `shortlisted`
- `on-hold`
- `rejected`
- `ready-for-interview`

Transition rules:

- `rejected` is terminal unless reopened by an authorized user
- `ready-for-interview` requires all mandatory screening tasks complete

# 16. Permissions

Permissions shall include:

- Create and edit screening templates
- Review and decide candidates
- Override knockout failures
- View assessment results
- Merge duplicates
- Reopen rejected or closed screening cases

# 17. Notifications

Notifications shall support:

- Recruiter alerts for new applications and aging queue thresholds
- Candidate communication for assessment requests and rejection outcomes
- Hiring manager summary when shortlist threshold is reached
- Operations alert when vendor assessment integration fails

# 18. Configuration

Administrators shall configure:

- Screening stages by requisition type
- Knockout rules and scoring models
- Assessment providers and package mapping
- Rejection reasons and hold reasons
- SLA targets and escalation thresholds

# 19. Edge Cases

The design shall address:

- Candidates applying to multiple requisitions with shared or separate screening outcomes
- Internal employees applying through the same pipeline
- Resume parse failure with manual fallback
- Candidate withdrawal during assessment
- Rehiring a former employee whose old profile should not contaminate current evaluation
