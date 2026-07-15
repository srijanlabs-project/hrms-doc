---
id: HRMS-SUB-20-01
title: Contractor master Specification
document: 01-contractor-master.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Contractor Master is the governed identity, assignment, and relationship record for non-employee workers such as contractors, consultants, vendor personnel, gig workers, and temporary external workforce members.

In scope:

- External worker master identity and profile
- Engagement, vendor, and sponsor linkage
- Assignment, site, and access context
- Lifecycle states from onboarding through offboarding
- Downstream identity, compliance, and asset integration

# 2. Business

External workforce populations often need system access, badges, assets, training, and compliance tracking similar to employees, but under different legal, operational, and privacy rules. Without a governed contractor master, organizations face access sprawl, weak vendor accountability, and poor visibility into who is working where and under whose authority.

Business objectives:

- Maintain a single operational record for each external worker
- Link every contractor to vendor, sponsor, and assignment context
- Support controlled access provisioning and offboarding
- Improve workforce visibility, vendor governance, and audit readiness

Key stakeholders:

- Vendor Management and Procurement
- HR Operations and Workforce Administration
- Site and Functional Managers
- IT, Security, and Facilities
- Compliance and Audit

# 3. Functional

The system shall support:

- Creation of contractor records from vendor onboarding, direct sponsor request, migration, or API feed
- Classification by contractor, consultant, agency worker, gig worker, or third-party partner category
- Vendor organization, contract, project, sponsor manager, and cost-center linkage
- Site, location, work mode, shift, and validity-period tracking
- Activation, extension, suspension, reassignment, expiry, and offboarding lifecycle
- Duplicate detection across identity, vendor, and work-assignment data
- Controlled fields for identity documents, company-issued IDs, and access-related attributes

Detailed rules:

- Every active contractor must have a sponsor, vendor or legal basis, engagement validity dates, and approved assignment context
- Contractor master should remain distinct from employee master while allowing some shared integrations
- Expired or suspended contractors should trigger downstream access and asset review
- Extensions must not silently continue a contractor beyond approved engagement dates
- Sensitive personal information must follow country-specific privacy and data-minimization rules

# 4. UX

Primary screens:

- Contractor master register
- Contractor profile and engagement view
- Sponsor and vendor linkage screen
- Validity and extension dashboard
- Offboarding and expiry control queue

UX expectations:

- Workforce admins should quickly identify who the contractor is, who sponsors them, and when access expires
- Managers should see assignment and renewal context without seeing restricted vendor or compliance data they do not need
- Expiry and missing-data warnings should be prominent and action-oriented

# 5. API

Representative APIs:

- `POST /api/v1/external-workforce/contractors`
- `GET /api/v1/external-workforce/contractors/{contractorId}`
- `PUT /api/v1/external-workforce/contractors/{contractorId}`
- `POST /api/v1/external-workforce/contractors/{contractorId}/extend`
- `POST /api/v1/external-workforce/contractors/{contractorId}/suspend`
- `POST /api/v1/external-workforce/contractors/{contractorId}/offboard`

API expectations:

- Create APIs must validate vendor, sponsor, assignment, and date completeness
- Extension and suspension APIs must publish identity- and access-impacting events
- Retrieval APIs should honor field sensitivity and organization-scope rules

# 6. Database

Core entities:

- `contractor_master`
- `contractor_engagement`
- `contractor_vendor_link`
- `contractor_assignment`
- `contractor_status_history`
- `contractor_source_mapping`

Key fields:

- Contractor code, external person ID, classification, status, validity dates
- Vendor ID, contract reference, sponsor manager, project, site, location
- Identity document type, document expiry, badge ID, system access eligibility
- Extension count, suspension reason, offboarding trigger, source-system linkage

Data design expectations:

- Engagement and assignment history should remain effective-dated
- Contractor records should support re-engagement without destroying prior history
- Vendor and sponsor lineage should remain reportable even after offboarding

# 7. Events

Published events:

- `contractor.created`
- `contractor.activated`
- `contractor.extended`
- `contractor.suspended`
- `contractor.expiry_due`
- `contractor.offboarded`

Consumed events:

- `vendor.approved`
- `site.assignment.changed`
- `compliance.case_failed`
- `badge.access_revoked`

# 8. Reports

Required reports:

- Contractor master register
- Contractor expiry report
- Vendor-wise contractor population report
- Suspended and inactive contractor report
- Contractor reassignment history report

# 9. Dashboards

Operational dashboards:

- Active contractors by vendor and site
- Upcoming expiries and renewals
- Missing sponsor or assignment anomalies
- Offboarding backlog
- External workforce headcount by classification

# 10. Security

Security requirements:

- Contractor identity and document fields should be access-controlled and masked appropriately
- Sponsor managers should see only workforce members in their authorized scope
- Vendor-linked data may require restricted visibility from internal users outside vendor-management roles

# 11. Audit

Audit coverage shall include:

- Contractor creation and source linkage
- Status changes, extensions, and suspensions
- Sponsor or vendor changes
- Assignment changes and offboarding actions
- Sensitive field views and edits

# 12. AI

AI-assisted opportunities:

- Predict expiry or offboarding risk based on engagement history
- Suggest duplicate matches across vendor feeds
- Highlight contractor populations likely missing mandatory controls

# 13. Test Cases

Core test scenarios:

- Create contractor with valid sponsor and vendor linkage
- Prevent activation without mandatory dates or sponsor
- Extend contractor engagement with full history retention
- Suspend contractor and publish downstream review event
- Offboard contractor and trigger access and asset closure

# 14. Workflows

Primary workflow:

1. Vendor or sponsor requests contractor onboarding.
2. System validates master profile, engagement, and assignment context.
3. Contractor is activated for downstream access, asset, and compliance processes.
4. Extensions, transfers, or suspensions are processed during active lifecycle.
5. Expiry or offboarding closes the contractor record operationally.

# 15. State Machine

Contractor state model:

- `Draft`
- `Pending Approval`
- `Active`
- `Suspended`
- `Expired`
- `Offboarded`
- `Archived`

# 16. Permissions

Representative permissions:

- `contractor_master.create`
- `contractor_master.edit`
- `contractor_master.extend`
- `contractor_master.suspend`
- `contractor_master.offboard`
- `contractor_master.audit.view`

# 17. Notifications

Notification scenarios:

- Contractor activation pending approval
- Engagement nearing expiry
- Contractor suspended
- Mandatory data missing
- Offboarding initiated or completed

# 18. Configuration

Configurable parameters:

- Contractor classifications
- Mandatory fields by country or category
- Expiry reminder lead time
- Extension approval model
- Sponsor eligibility rules

# 19. Edge Cases

Important edge cases:

- Same person is engaged by two vendors at different times
- Contractor changes site while core engagement remains active
- Engagement expires while access or asset return is still open
- Contractor is converted to employee and needs linked but separate historical record
