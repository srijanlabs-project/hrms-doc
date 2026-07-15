---
id: HRMS-SUB-11-03
title: 360 feedback Specification
document: 03-360-feedback.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

360 Feedback governs the collection of structured input from peers, direct reports, managers, and other stakeholders to assess behavioral effectiveness, collaboration, and leadership impact.

In scope:

- Rater nomination and approval
- Anonymous or named response collection
- Competency and behavior questionnaires
- Feedback summarization and release controls
- Integration to appraisal and development planning

# 2. Business

360 feedback brings multi-source perspective into development and leadership evaluation. It is especially important for managerial, customer-facing, and cross-functional roles where goal achievement alone does not reflect effectiveness.

Business outcomes:

- Improve leadership and behavior insight beyond manager-only views
- Encourage self-awareness and development planning
- Provide supplemental evidence for performance and succession conversations
- Strengthen feedback culture across the organization

# 3. Functional

The system shall support:

- 360 campaigns tied to development programs, appraisal cycles, or stand-alone surveys
- Rater categories such as manager, peer, direct report, project stakeholder, and self
- Rater nomination by employee, manager, or HR with approval workflow
- Anonymous, confidential, or named response modes by campaign
- Question banks for competencies, values, leadership behaviors, and custom items
- Rating-scale and open-text responses with required question rules
- Response reminders, closure, non-response tracking, and minimum-response thresholds
- Report release rules that prevent deanonymization where sample size is too small
- Export of summary themes to development plans or appraisal attachments

Validation rules:

- Campaign cannot release direct-report results unless anonymity threshold is met
- A rater shall not submit more than one active response for the same target and campaign unless reset by administrator
- Removed raters shall lose access immediately and their incomplete responses shall follow policy

# 4. UX

The user experience shall provide:

- Nomination wizard with rater-category quotas and conflict warnings
- Simple feedback form optimized for completion speed
- Progress and save-and-return support for raters
- Recipient report view with strengths, blind spots, and development themes
- Confidentiality messaging that clearly explains anonymity rules

# 5. API

Representative APIs:

- `POST /api/v1/performance/360-campaigns`
- `POST /api/v1/performance/360-campaigns/{campaignId}/raters`
- `POST /api/v1/performance/360-responses`
- `POST /api/v1/performance/360-campaigns/{campaignId}/release`
- `GET /api/v1/performance/employees/{employeeId}/360-summary`

API requirements:

- Response APIs shall enforce token security and campaign eligibility
- Release APIs shall verify threshold and anonymity policy before generating reports
- Analytics endpoints shall exclude identifiable detail when anonymity applies

# 6. Database

Core entities:

- `feedback_360_campaign`
- `feedback_360_participant`
- `feedback_360_rater`
- `feedback_360_response`
- `feedback_360_question`
- `feedback_360_report`

Key data requirements:

- Campaign records shall store scope, anonymity mode, response thresholds, and release dates
- Response records shall store question answers, timestamps, and completion status
- Reports shall retain generated snapshots and release metadata

# 7. Events

The platform shall publish:

- `feedback360.campaign.created`
- `feedback360.rater.nominated`
- `feedback360.response.submitted`
- `feedback360.threshold.met`
- `feedback360.report.released`

# 8. Reports

Required reports:

- Campaign participation and response completion report
- Competency average report by cohort
- Rater-category response gap report
- Development theme analysis across leadership levels

# 9. Dashboards

Dashboards shall show:

- Open campaigns and response completion %
- Anonymity-threshold risk by participant
- Leadership competency heatmap
- Report release readiness

# 10. Security

Security controls shall include:

- Strong isolation of raw responses where anonymity is promised
- Tokenized access for raters with expiry and revocation
- Prevention of report generation when small sample size risks identity exposure
- Restricted HR access to raw text comments if policy requires

# 11. Audit

The audit trail shall capture:

- Nomination additions, removals, and approvals
- Response submissions and resets
- Anonymity setting changes
- Report generation and release history

# 12. AI

AI capabilities may include:

- Theme clustering across narrative comments
- Strength and development summary drafting
- Toxic or inappropriate language detection in free text

AI guardrails:

- AI summaries shall preserve anonymity constraints
- Low-sample responses shall not be over-interpreted or individually exposed

# 13. Test Cases

Minimum test coverage shall include:

- Report release blocked when anonymity threshold is not met
- Rater token expires and is rejected securely
- Removed rater cannot continue submission
- Summary report excludes identifiable single-response details
- Campaign reminders stop after final submission

# 14. Workflows

Primary workflow:

1. Campaign is created and participants are selected.
2. Raters are nominated and approved.
3. Responses are collected with reminders.
4. Threshold and quality checks run.
5. Report is generated and released to authorized viewers.

# 15. State Machine

Supported states:

- `draft`
- `nominations-open`
- `collecting-responses`
- `threshold-review`
- `report-generated`
- `released`
- `closed`

# 16. Permissions

Permissions shall include:

- Create and manage campaigns
- Nominate or approve raters
- View raw responses
- Release reports
- Reopen or close campaigns

# 17. Notifications

Notifications shall support:

- Rater invitation and reminder emails
- Participant updates on nomination approval
- HR alerts for low response risk
- Release notifications for completed reports

# 18. Configuration

Administrators shall configure:

- Question banks and scales
- Anonymity thresholds by rater category
- Nomination quotas and approval rules
- Reminder cadence and campaign duration
- Report layouts and visibility rules

# 19. Edge Cases

The design shall address:

- Very small teams where anonymity is hard to preserve
- Participant changes manager during campaign
- Rater leaves organization before completing response
- Same person belongs to multiple rater categories
- Campaign used only for development and not appraisal, requiring different retention rules
