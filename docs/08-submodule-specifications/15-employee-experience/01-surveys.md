---
id: HRMS-SUB-15-01
title: Surveys Specification
document: 01-surveys.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Surveys provides the structured listening capability for capturing employee sentiment, feedback, pulse checks, lifecycle feedback, engagement data, and targeted opinion input across the enterprise.

In scope:

- Survey design and publishing
- Audience targeting and participation controls
- Anonymous and identified response modes
- Reminder, closure, and response analytics
- Action planning and downstream insight consumption

# 2. Business

Employee surveys help the organization understand engagement, culture, inclusion, leadership effectiveness, onboarding quality, exit experience, training impact, and operational pain points. Without a governed survey capability, feedback becomes fragmented, low-trust, and difficult to convert into action.

Business objectives:

- Standardize enterprise listening programs
- Improve response trust through confidentiality controls
- Generate reliable insights for HR, managers, and leadership
- Link feedback collection to follow-up action and measurable improvement

# 3. Functional

The system shall support:

- Survey creation from blank, template, pulse, lifecycle, or campaign models
- Question types including rating, Likert, text, ranking, multiple choice, matrix, and NPS-style questions
- Audience selection by employee population, location, department, grade, manager hierarchy, tenure, or event trigger
- Anonymous, confidential, and identified response modes
- Multi-language survey delivery
- Draft, review, publish, pause, close, and archive lifecycle
- Reminder cadence and non-responder tracking
- Action-plan creation or case generation from survey findings where configured

Detailed rules:

- Anonymous mode must prevent managers or local admins from inferring identity through low-volume slices where threshold rules apply
- Survey edits after publish must be controlled and may require versioning or republish behavior
- Target audience should be snapshotted at publish time unless dynamic audience mode is explicitly enabled
- Response windows, reminder intervals, and analytics eligibility should be policy-driven

# 4. UX

Primary screens:

- Survey builder
- Audience and confidentiality setup
- Survey response experience
- Campaign monitoring dashboard
- Insights and action planning workspace

UX expectations:

- Authors should build surveys without needing technical support
- Employees should complete surveys easily on mobile and desktop
- Confidentiality explanations should be clear before response submission
- HR and leaders should see insight-first summaries before raw response details

# 5. API

Representative APIs:

- `POST /api/v1/employee-experience/surveys`
- `PUT /api/v1/employee-experience/surveys/{surveyId}`
- `POST /api/v1/employee-experience/surveys/{surveyId}/publish`
- `POST /api/v1/employee-experience/surveys/{surveyId}/responses`
- `GET /api/v1/employee-experience/surveys/{surveyId}/analytics`
- `POST /api/v1/employee-experience/surveys/{surveyId}/close`

# 6. Database

Core entities:

- `survey_definition`
- `survey_question`
- `survey_audience_snapshot`
- `survey_response`
- `survey_response_item`
- `survey_campaign`
- `survey_action_plan`

Key fields:

- Survey code, title, type, confidentiality mode, language pack, status
- Question type, response options, scoring flag, mandatory flag
- Audience dimensions, inclusion criteria, exclusion criteria, published population count
- Response timestamp, respondent token, anonymity class, completion status
- Insight category, action owner, target date, closure status

# 7. Events

Published events:

- `survey.created`
- `survey.published`
- `survey.response_submitted`
- `survey.closed`
- `survey.action_plan_created`

Consumed events:

- `employee.joined`
- `employee.exited`
- `learning.program_completed`
- `onboarding.case_closed`

# 8. Reports

Required reports:

- Survey participation report
- Engagement score trend report
- Non-responder report
- Survey action-plan completion report
- Confidentiality-threshold suppression report

# 9. Dashboards

Operational dashboards:

- Active survey campaigns
- Response rate by audience segment
- Engagement movement over time
- Low-score hotspots by function or location
- Open action plans from surveys

# 10. Security

Security requirements:

- Response-level access must respect confidentiality mode and threshold suppression rules
- Anonymous response storage should avoid exposing respondent identity through indirect fields
- Only authorized insight users may access free-text responses where risk of re-identification exists

# 11. Audit

Audit coverage shall include:

- Survey creation, edit, approval, publish, pause, and close
- Audience selection changes
- Confidentiality mode changes
- Response export activity
- Action-plan creation and closure

# 12. AI

AI-assisted opportunities:

- Summarize free-text responses into themes, risks, and strengths
- Detect emerging sentiment shifts earlier than manual review
- Recommend follow-up questions or action plans based on themes

AI guardrails:

- AI summaries must preserve confidentiality thresholds
- Raw text should not be exposed to unauthorized viewers through summaries

# 13. Test Cases

Core test scenarios:

- Publish anonymous survey to target audience
- Submit response in identified and anonymous modes
- Enforce minimum-response threshold before manager view
- Close survey and prevent late submission
- Create action plan from low-scoring theme

# 14. Workflows

Primary workflow:

1. HR or business owner designs survey.
2. Audience and confidentiality settings are reviewed.
3. Survey is published and reminders are scheduled.
4. Employees submit responses during the active window.
5. Insights are analyzed and action plans are tracked.

# 15. State Machine

Survey state model:

- `Draft`
- `Under Review`
- `Published`
- `Paused`
- `Closed`
- `Archived`

Response state model:

- `Started`
- `Saved`
- `Submitted`
- `Invalidated`

# 16. Permissions

Representative permissions:

- `survey.create`
- `survey.publish`
- `survey.respond`
- `survey.analytics.view`
- `survey.response.export`
- `survey.action_plan.manage`
- `survey.audit.view`

# 17. Notifications

Notification scenarios:

- Survey launch
- Reminder to incomplete respondents
- Survey closing soon
- Action plan assigned from survey outcome
- New insight pack available for reviewed campaign

# 18. Configuration

Configurable parameters:

- Confidentiality threshold
- Reminder cadence
- Supported question types
- Multi-language behavior
- Response editability before submission
- Action-plan integration rules

# 19. Edge Cases

Important edge cases:

- Small audience creates re-identification risk in anonymous mode
- Employee moves to a new department after audience snapshot
- Survey is reopened after executive review request
- Free-text response contains sensitive grievance information requiring alternate handling
