---
id: HRMS-SUB-23-01
title: Campaigns Specification
document: 01-campaigns.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Campaigns governs targeted employee communications delivered through email, in-app, mobile, SMS, portal banners, or multi-channel orchestration for awareness, action, change adoption, and compliance communication.

In scope:

- Campaign planning and audience targeting
- Message authoring and approval
- Channel orchestration and scheduling
- Delivery tracking and engagement analytics
- Compliance, consent, and communication governance

# 2. Business

Enterprise HRMS platforms often need reliable communications for policy rollout, open enrollment, surveys, mandatory actions, payroll notices, training reminders, and change-management programs. A governed campaigns module reduces fragmented communications and improves employee action completion.

Business objectives:

- Deliver the right message to the right audience at the right time
- Support action-driving communications with measurable outcomes
- Centralize HR and workforce communication governance
- Improve engagement, awareness, and completion rates for key initiatives

# 3. Functional

The system shall support:

- Audience selection by entity, location, function, role, lifecycle status, manager hierarchy, or behavioral trigger
- Multi-channel campaign delivery through email, SMS, push, in-app, and portal surfaces
- One-time, recurring, triggered, and phased communication models
- Draft, review, approve, schedule, launch, pause, and close lifecycle
- Localization, personalization, merge fields, and action links
- Suppression rules, consent handling, and quiet-hour behavior where applicable
- Delivery, open, click, and completion metrics capture

Detailed rules:

- Campaign approvals may be required based on audience size, legal sensitivity, or channel type
- Personalization fields must be validated before launch to avoid broken or unsafe content
- Triggered campaigns should be idempotent to avoid duplicate delivery from repeated source events
- Suppression and unsubscribe rules must be respected according to jurisdiction and campaign purpose
- Time-sensitive operational campaigns should support escalation or resend strategy when delivery failure exceeds threshold
- AI-triggered or event-triggered HR communications must use approved templates, governed audience criteria, and explicit approval rules for sensitive payroll, legal, or employee-relations messages
- Audience snapshots and dynamic audiences should remain distinguishable for audit and metrics interpretation

# 4. UX

Primary screens:

- Campaign planner
- Audience builder
- Message editor and preview
- Delivery monitor
- Engagement analytics dashboard

UX expectations:

- Business users should assemble campaigns without depending on developers
- Preview should support channel-specific rendering and localization checks
- Analytics should clearly separate delivery failure from lack of engagement
- High-risk launches should require explicit pre-send confirmation

# 5. API

Representative APIs:

- `POST /api/v1/communications/campaigns`
- `POST /api/v1/communications/campaigns/{campaignId}/schedule`
- `POST /api/v1/communications/campaigns/{campaignId}/launch`
- `GET /api/v1/communications/campaigns/{campaignId}/metrics`
- `POST /api/v1/communications/campaigns/{campaignId}/pause`
- `POST /api/v1/communications/campaigns/{campaignId}/resume`

# 6. Database

Core entities:

- `campaign`
- `campaign_audience_snapshot`
- `campaign_message_variant`
- `campaign_delivery`
- `campaign_metric_aggregate`
- `campaign_suppression_rule`

Key fields:

- Campaign code, purpose, owner, status, channel mix, schedule
- Audience definition, audience size, snapshot time, inclusion and exclusion rules
- Locale, message subject, body, CTA, personalization schema
- Delivery status, bounce reason, open and click timestamps, completion signal
- Suppression reason, unsubscribe source, legal-basis category
- Approval record, compliance sensitivity, and emergency-override flag
- Trigger source event, deduplication token, and resend strategy

# 7. Events

Published events:

- `campaign.created`
- `campaign.scheduled`
- `campaign.launched`
- `campaign.paused`
- `campaign.completed`
- `campaign.delivery_failed`

Consumed events:

- `employee.joined`
- `benefits.window_opened`
- `training.overdue`
- `survey.published`
- `policy.version_published`

# 8. Reports

Required reports:

- Campaign performance report
- Delivery failure report
- Audience reach report
- Engagement and click-through report
- Compliance and unsubscribe report
- Localization completion report
- CTA conversion funnel report

# 9. Dashboards

Operational dashboards:

- Active campaigns by channel
- Delivery success rate
- Open and click performance
- Action completion driven by campaigns
- Suppression and consent anomalies

# 10. Security

Security requirements:

- Large-audience or legally sensitive campaigns should require stronger approval controls
- Personal data used for targeting and personalization must follow privacy rules
- Communications with payroll, benefits, or disciplinary content may require restricted authoring permissions

# 11. Audit

Audit coverage shall include:

- Campaign creation and content edits
- Audience selection changes
- Approval and launch actions
- Pause, resume, and cancellation actions
- Export of campaign recipient or engagement data

# 12. AI

AI-assisted opportunities:

- Draft message variants tailored to audience and channel
- Predict engagement rates and recommend send timing
- Detect risky wording, broken personalization, or low-readability content
- Propose triggered communication drafts for lifecycle events such as onboarding, payroll notice, policy acknowledgment, training reminder, or case-status change

AI guardrails:

- AI should not send emergency or legal-notice campaigns without explicit human launch approval
- Generated personalization should never infer protected or sensitive employee attributes without a configured source field

AI guardrails:

- AI-generated content must remain reviewable before launch
- Sensitive policy or legal messages should not auto-send from AI drafts

# 13. Test Cases

Core test scenarios:

- Create and schedule localized multi-channel campaign
- Validate personalization fields before launch
- Trigger campaign from source event without duplicate sends
- Pause and resume active campaign
- Track delivery and engagement metrics accurately
- Suppress recipients according to consent or unsubscribe status
- Trigger fallback alert when delivery failure threshold is breached

# 14. Workflows

Primary workflow:

1. Business owner creates campaign and target audience.
2. Content is authored, previewed, and approved.
3. Campaign is scheduled or launched.
4. Delivery and engagement metrics are tracked.
5. Follow-up or action-completion reporting is reviewed.

# 15. State Machine

Campaign state model:

- `Draft`
- `Pending Approval`
- `Scheduled`
- `Active`
- `Paused`
- `Completed`
- `Cancelled`

# 16. Permissions

Representative permissions:

- `campaign.create`
- `campaign.approve`
- `campaign.launch`
- `campaign.pause`
- `campaign.metrics.view`
- `campaign.audit.view`

# 17. Notifications

Notification scenarios:

- Campaign awaiting approval
- Launch completed
- Delivery failure spike detected
- Campaign paused or cancelled
- Performance milestone reached

# 18. Configuration

Configurable parameters:

- Channel availability
- Consent and suppression behavior
- Quiet hours
- Approval thresholds
- Metric-retention policy

# 19. Edge Cases

Important edge cases:

- Audience membership changes after scheduled snapshot
- Multi-language content missing one locale variant
- Triggered campaign fires twice from duplicate source event
- Legal notice must override normal unsubscribe suppression rules
