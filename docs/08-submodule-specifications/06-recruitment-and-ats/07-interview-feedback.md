---
id: HRMS-SUB-06-07
title: Interview feedback Specification
document: 07-interview-feedback.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Interview Feedback governs how interviewers record structured evaluations, recommendations, concerns, and evidence after candidate interactions so hiring decisions remain consistent, timely, and defensible.

In scope:

- Scorecards and competency-based evaluation
- Written observations and recommendation capture
- Consolidation across multiple interviewers and rounds
- Decision readiness checks and overdue follow-up
- Feedback quality controls and bias safeguards

# 2. Business

Interview feedback is the decision-quality backbone of recruitment. Without structured feedback, organizations depend on memory, informal opinion, and inconsistent criteria, creating hiring delays and exposure to bias or compliance challenges.

Business outcomes:

- Improve quality and consistency of hiring recommendations
- Reduce decision cycle time after interviews
- Provide evidence for offers, rejections, and audit reviews
- Enable analytics on interviewer effectiveness and candidate quality

# 3. Functional

The system shall support:

- Interview scorecards mapped to role, level, family, and interview stage
- Rating scales with configurable anchors and mandatory evidence fields
- Recommendation outcomes such as strong hire, hire, mixed, no hire, and strong no hire
- Separate capture of strengths, risks, follow-up topics, and culture or values alignment
- Multiple interviewer submissions for the same round with weighted or unweighted consolidation
- Feedback due dates and escalation for incomplete submissions
- Reopen, amend, or supersede feedback under controlled permissions
- Interview debrief workflows for panel consensus
- Hidden recruiter-only notes separate from official scorecards where allowed
- Bias-awareness prompts and prohibited-language detection

Validation rules:

- Interview completion shall not automatically move candidate state until required feedback count is met
- Mandatory competencies shall require ratings before submission
- Late or amended feedback shall retain prior versions for audit
- Interviewers shall not see other interviewers' feedback before submitting when blind mode is enabled

# 4. UX

The user experience shall provide:

- Guided scorecard layout with competencies, rubric help text, and evidence prompts
- Quick-submit mode for experienced interviewers and expanded mode for detailed evaluators
- Visual feedback completeness indicator before submission
- Debrief view showing round summary, variance across interviewers, and unresolved concerns
- Mobile-friendly submission for on-the-go panel members

# 5. API

Representative APIs:

- `POST /api/v1/recruitment/interviews/{interviewId}/feedback`
- `PATCH /api/v1/recruitment/interviews/{interviewId}/feedback/{feedbackId}`
- `GET /api/v1/recruitment/candidates/{candidateId}/feedback-summary`
- `POST /api/v1/recruitment/interviews/{interviewId}/debrief`
- `POST /api/v1/recruitment/candidates/{candidateId}/decision-ready`

API requirements:

- Feedback submission shall enforce rubric completeness server-side
- Draft saves shall support partial completion and autosave metadata
- Consolidation APIs shall identify contributing interview records and version lineage

# 6. Database

Core entities:

- `interview_feedback`
- `interview_feedback_rating`
- `interview_feedback_comment`
- `interview_debrief`
- `feedback_template`
- `feedback_version_log`

Key data requirements:

- Feedback records shall store interviewer, role, stage, recommendation, submitted timestamp, and blind-review flag
- Rating rows shall capture competency, rating value, rubric band, and comment
- Debrief records shall capture decision summary, disagreements, and next action

# 7. Events

The platform shall publish:

- `interview.feedback.draft-saved`
- `interview.feedback.submitted`
- `interview.feedback.overdue`
- `candidate.debrief.completed`
- `candidate.hiring-decision.ready`

# 8. Reports

Required reports:

- Feedback completion SLA report
- Recommendation distribution by interviewer, role, and business unit
- Rating variance and calibration report for interviewers
- Hiring decision lead time after final interview

# 9. Dashboards

Dashboards shall show:

- Pending feedback tasks by interviewer
- Candidates blocked due to incomplete feedback
- Score distribution by requisition and stage
- High-variance interviews needing debrief attention

# 10. Security

Security controls shall include:

- Role-based access to candidate feedback artifacts
- Blind feedback mode where peer responses are hidden until submission
- Restricted access to interviewer-only notes and sensitive allegations
- Tamper-resistant versioning for submitted evaluations

# 11. Audit

The audit trail shall capture:

- Draft creation, final submission, and edits after submission
- Rubric changes after interview start
- Debrief decisions and override of panel recommendation
- Visibility changes for blind-review or note-sharing settings

# 12. AI

AI capabilities may include:

- Summarization of common strengths and risk themes across interview rounds
- Detection of contradictory feedback or low-evidence recommendations
- Suggestions for follow-up interview topics based on gaps
- Language checks for potentially biased or non-compliant wording

AI guardrails:

- AI shall not replace interviewer judgment or generate final recommendations autonomously
- Users shall see the source excerpts behind AI summaries

# 13. Test Cases

Minimum test coverage shall include:

- Blind feedback mode hides peer responses until submission
- Mandatory rubric fields block final submit
- Edited feedback retains full version history
- Debrief completion creates correct decision-ready event
- Overdue reminders stop once feedback is submitted

# 14. Workflows

Primary workflow:

1. Interview completes.
2. Interviewer receives feedback task.
3. Interviewer submits scorecard and recommendation.
4. System checks completeness across all required panel members.
5. Candidate moves to debrief or next stage based on policy.

# 15. State Machine

Supported states:

- `not-started`
- `draft`
- `submitted`
- `overdue`
- `amended`
- `superseded`
- `archived`

# 16. Permissions

Permissions shall include:

- Create and edit feedback templates
- Submit interview feedback
- Amend submitted feedback
- View consolidated summaries
- Run or record debrief outcomes
- Override final recommendation

# 17. Notifications

Notifications shall support:

- Feedback task assignment and reminders
- Escalation to recruiter or hiring manager for overdue inputs
- Debrief scheduling alerts
- Candidate movement notifications to recruiters when decision-ready

# 18. Configuration

Administrators shall configure:

- Scorecards by job family and level
- Mandatory competencies and evidence rules
- Blind-review rules and debrief requirements
- Reminder cadence and escalation thresholds
- Recommendation labels and stage-move mappings

# 19. Edge Cases

The design shall address:

- Interviewer submits feedback after candidate already moved forward
- Panel disagreement requires extra interviewer before decision
- Candidate interviewed by replacement panel due to reschedule
- Serious misconduct allegation appears inside feedback and needs confidential workflow
- Same interviewer participates in multiple rounds with different rubric versions
