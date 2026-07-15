---
id: HRMS-APP-03
title: Notification and Message Catalog Index
document: 03-notification-catalog-framework.md
version: 2.0
status: Draft
---

# 1. Purpose

This appendix acts as the master index for notifications, message templates, and event-driven communications across the Enterprise HRMS platform.

# 2. Primary Detailed References

- [09-event-producer-consumer-matrix.md](D:/HRMS-doc/docs/07-appendices/09-event-producer-consumer-matrix.md)
- [16-message-catalog-by-event.md](D:/HRMS-doc/docs/07-appendices/16-message-catalog-by-event.md)

# 3. Catalog Layers

- `Event layer`
  Defines what happened and which systems consume it.
- `Notification layer`
  Defines whether the event should generate user-visible or operator-visible outreach.
- `Message layer`
  Defines channel-specific template keys, merge fields, severity, and localization behavior.

# 4. Seed Communication Categories

| Category Ref | Category | Typical Trigger Type | Primary Audience |
|---|---|---|---|
| `MSG-CAT-001` | Workflow and approval | task created, task escalated, decision taken | employee, manager, HR, org admin |
| `MSG-CAT-002` | Lifecycle and workforce | onboarding, transfer, exit, contractor lifecycle | employee, HR, manager, support |
| `MSG-CAT-003` | Recruitment and offers | requisition, interview, offer, candidate actions | recruiter, hiring manager, candidate |
| `MSG-CAT-004` | Time, leave, and payroll | leave decisions, payroll status, exception alerts | employee, manager, payroll |
| `MSG-CAT-005` | Security and privacy | support session, export review, masking reveal, access review | platform security, org admin, privacy leads |
| `MSG-CAT-006` | Platform operations | provisioning, integration failures, DR, dead letters | platform admin, ops, support |

# 5. Usage Rules

- every event that produces a user-visible or operator-visible communication should have a message-catalog entry
- event definitions and message templates should be linked by stable references
- channel-specific wording should live in the message catalog, not in workflow or API docs
