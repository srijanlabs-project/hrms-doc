---
id: HRMS-APP-05
title: Event Catalog Index
document: 05-event-catalog-framework.md
version: 2.0
status: Draft
---

# 1. Purpose

This appendix acts as the master index for domain and platform events in the Enterprise HRMS platform.

# 2. Primary Detailed Reference

- [09-event-producer-consumer-matrix.md](D:/HRMS-doc/docs/07-appendices/09-event-producer-consumer-matrix.md)

# 3. Seed Event Families

| Family Ref | Event Family | Representative Examples | Typical Consumers |
|---|---|---|---|
| `EVF-001` | Tenant lifecycle | `tenant.created`, `tenant.activated` | identity, config baseline, support, audit |
| `EVF-002` | Workforce lifecycle | `employee.created`, `employee.offboarded`, `contractor.activated` | workflow, access, assets, analytics |
| `EVF-003` | Recruitment lifecycle | `requisition.submitted`, `offer.accepted` | workflow, onboarding, notifications |
| `EVF-004` | Time and leave | `leave.request-approved`, `attendance.corrected` | payroll, calendars, manager views |
| `EVF-005` | Payroll lifecycle | `payroll.run-finalized` | documents, finance integration, compliance |
| `EVF-006` | Document and signature | `document.generated`, `document.signed` | repositories, workflow, audit |
| `EVF-007` | Workflow and notifications | `workflow.task-created`, `notification.dispatch-failed` | inbox, reminders, ops |
| `EVF-008` | Platform and support governance | `event-bus.dead-letter.created`, `support.session-started` | ops, security, SIEM, privacy monitoring |

# 4. Usage Rules

- every event implementation should have one primary producer and an explicit `Event Ref`
- if an event causes user-facing communication, it should also map to a message-catalog entry
- replay-sensitive events must document idempotency expectations for consumers
