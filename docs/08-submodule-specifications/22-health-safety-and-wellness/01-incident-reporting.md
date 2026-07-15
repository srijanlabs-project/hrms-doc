---
id: HRMS-SUB-22-01
title: Incident reporting Specification
document: 01-incident-reporting.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Incident Reporting governs the capture, classification, triage, investigation, and closure of workplace incidents, near misses, injuries, exposures, and safety-related events.

In scope:

- Incident intake and initial triage
- Severity and impact classification
- Investigation, evidence, and corrective action tracking
- Regulatory and internal reporting
- Closure and trend analysis

# 2. Business

Incident reporting is a foundational health and safety control. Organizations need reliable records of what happened, who was affected, what immediate action was taken, and what corrective measures are required to prevent recurrence.

Business objectives:

- Ensure timely capture of safety and workplace incidents
- Support investigation and corrective action with defensible evidence
- Meet internal and regulatory reporting obligations
- Identify recurring risk patterns and prevention opportunities

# 3. Functional

The system shall support:

- Incident types such as injury, illness, near miss, unsafe condition, security event, environmental event, and property damage
- Intake through employee self-report, manager report, safety officer entry, or integration source
- Initial severity and potential severity classification
- Involved-person tracking, witness recording, and location context
- Investigation workflow, root-cause analysis, corrective action plans, and final closure
- Regulatory notification flags and reportability determination
- Attachment of photos, statements, medical notes, and external evidence

Detailed rules:

- Critical incidents should trigger immediate escalation and emergency workflow hooks
- Near-miss and unsafe-condition reports should be supported even without injury
- Reportability decisions must be versioned if incident facts change during investigation
- Closure should require required evidence, corrective-action status, and final classification
- Incident records should support both actual severity and potential severity to preserve prevention insight
- Person privacy controls should distinguish broad site reporting from restricted medical or legal detail

# 4. UX

Primary screens:

- Report incident form
- Incident triage queue
- Investigation case workspace
- Corrective action tracker
- Incident analytics dashboard

UX expectations:

- Frontline users should be able to report quickly from desktop or mobile
- Safety teams should move from incident summary to evidence and action plan in one flow
- Sensitive incidents should expose only the minimum necessary detail to general viewers

# 5. API

Representative APIs:

- `POST /api/v1/ehs/incidents`
- `GET /api/v1/ehs/incidents/{incidentId}`
- `POST /api/v1/ehs/incidents/{incidentId}/triage`
- `POST /api/v1/ehs/incidents/{incidentId}/investigation`
- `POST /api/v1/ehs/incidents/{incidentId}/corrective-actions`
- `POST /api/v1/ehs/incidents/{incidentId}/close`

# 6. Database

Core entities:

- `incident_report`
- `incident_person`
- `incident_investigation`
- `incident_evidence`
- `incident_corrective_action`
- `incident_regulatory_flag`

Key fields:

- Incident reference, type, severity, occurrence time, reported time, location
- Reporter, affected person, witness, supervisor, safety owner
- Root-cause category, investigation status, final classification
- Corrective action owner, target date, effectiveness review status
- Regulatory reportable flag, authority notified, notification timestamp
- Potential severity, lost-time indicator, environmental impact indicator
- Investigation lead, legal-hold flag, insurer-notified flag

# 7. Events

Published events:

- `incident.reported`
- `incident.triaged`
- `incident.escalated`
- `incident.corrective_action_created`
- `incident.closed`

Consumed events:

- `emergency.response_activated`
- `risk_assessment.updated`
- `medical_case.recorded`

# 8. Reports

Required reports:

- Incident register
- Near-miss report
- Injury severity report
- Corrective-action completion report
- Regulatory reportable incident report
- Lost-time injury frequency report
- Incident source and contributing-factor report

# 9. Dashboards

Operational dashboards:

- Open incidents by severity
- Incident frequency by site
- Corrective action overdue
- Near-miss trend
- High-risk incident clusters

# 10. Security

Security requirements:

- Incident data may contain medical, disciplinary, or legal sensitivity and must be carefully scoped
- Sensitive attachments and witness statements should have restricted access
- Regulatory evidence exports should be tightly controlled

# 11. Audit

Audit coverage shall include:

- Initial report creation
- Severity reclassification
- Investigation and root-cause changes
- Corrective-action updates
- Closure and reportability decisions

# 12. AI

AI-assisted opportunities:

- Suggest likely incident category and severity from initial narrative
- Cluster recurring incident patterns by site or role
- Summarize investigation timelines and overdue actions

AI guardrails:

- AI should not make final reportability or legal classification decisions automatically
- Medical or personally sensitive content must remain scope-filtered in summaries

# 13. Test Cases

Core test scenarios:

- Report near miss with photo evidence
- Escalate critical incident immediately
- Reclassify incident after investigation findings
- Create corrective action and track closure
- Restrict sensitive incident details from unauthorized viewers
- Preserve original incident narrative after later reclassification
- Record both actual and potential severity for prevention analytics

# 14. Workflows

Primary workflow:

1. Incident is reported.
2. Safety team triages severity and response needs.
3. Investigation and evidence collection occur.
4. Corrective actions are assigned and tracked.
5. Incident is closed with final classification and analytics updates.

# 15. State Machine

Incident state model:

- `Reported`
- `Triaged`
- `Under Investigation`
- `Action In Progress`
- `Closed`
- `Reopened`

# 16. Permissions

Representative permissions:

- `incident.report`
- `incident.triage`
- `incident.investigate`
- `incident.close`
- `incident.view_sensitive`
- `incident.audit.view`

# 17. Notifications

Notification scenarios:

- Critical incident reported
- Investigation assigned
- Corrective action overdue
- Regulatory notification required
- Incident closed

# 18. Configuration

Configurable parameters:

- Incident taxonomy
- Severity matrix
- Escalation thresholds
- Regulatory reporting rules
- Corrective-action templates

# 19. Edge Cases

Important edge cases:

- Incident is initially reported as near miss and later becomes recordable injury
- Multiple witnesses submit overlapping reports for same event
- Network outage delays real-time incident reporting from remote site
- Incident involves contractor and employee populations simultaneously
