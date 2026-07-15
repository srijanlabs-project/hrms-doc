---
id: HRMS-APP-36
title: Audit Service Implementation Pack
document: 36-audit-service-implementation-pack.md
version: 1.0
status: Draft
---

# 1. Purpose

This appendix closes the audit-runtime depth gap by defining concrete audit APIs, payload families, physical schema elements, explorer screens, and SIEM/export mappings.

# 2. Concrete API Families

- `POST /api/v1/platform/audit/events`
- `GET /api/v1/platform/audit/events`
- `GET /api/v1/platform/audit/entities/{entityType}/{entityId}`
- `POST /api/v1/platform/audit/evidence-pack`
- `POST /api/v1/platform/audit/legal-holds`
- `POST /api/v1/platform/audit/integrity/verify`

# 3. Payload Families

- action event payload
- privileged read payload
- support-session event payload
- evidence export request payload
- legal-hold payload

# 4. Physical Entities

- `audit_event`
- `audit_event_detail`
- `audit_export`
- `audit_legal_hold`
- `audit_integrity_check`

# 5. Required Explorer Screens

- audit search
- entity timeline
- masked versus reveal audit view
- evidence export queue
- legal hold manager

# 6. SIEM and Governance Mappings

Forward these event classes:

- privileged access
- support session actions
- unusual export patterns
- integrity failures
- high-risk configuration changes

