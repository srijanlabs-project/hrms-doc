---
id: HRMS-SUB-18-01
title: Asset assignment Specification
document: 01-asset-assignment.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Asset Assignment governs the controlled issue of physical, digital, and access-linked assets to employees, contractors, interns, or other authorized workforce participants.

In scope:

- Asset allocation and reservation
- Assignment approval and eligibility validation
- Custody acceptance and acknowledgment
- Temporary, permanent, pooled, and shared assignment modes
- Downstream integration to onboarding, finance, support, and exit processes

# 2. Business

Enterprise organizations assign laptops, phones, ID cards, SIMs, tools, PPE, software tokens, access badges, and specialized equipment. Poorly governed assignment leads to missing assets, duplicate issue, unauthorized access, compliance failures, and unnecessary procurement spend.

Business objectives:

- Ensure every issued asset is traceable to a responsible custodian
- Reduce asset loss, idle inventory, and unauthorized allocation
- Support onboarding and role-change readiness through timely fulfillment
- Maintain evidence for audits, insurance, and financial accountability

Key stakeholders:

- IT and Workplace Operations
- HR Operations and Onboarding Teams
- Managers and Cost Center Owners
- Employees and Contractors
- Finance, Security, and Audit

# 3. Functional

The system shall support:

- Assignment of serialized and non-serialized assets
- Reservation, issue, acknowledgement, transfer, and reassignment flows
- Eligibility checks by role, location, employment type, contractor status, and security clearance
- Permanent, temporary, loaner, project-based, and pooled asset assignment models
- Kit-based issue such as new-joiner bundles or site-specific equipment sets
- Assignment dependencies linked to onboarding, transfer, travel, or project deployment
- Lost, damaged, or exception issue workflows where standard assignment path cannot complete

Detailed rules:

- Asset must be available, serviceable, and within allowed location or stock scope before assignment
- High-value or security-sensitive assets may require approval before issue
- User acknowledgment may be mandatory before asset status becomes fully assigned
- Shared or pooled assets must preserve checkout and return traceability even when not permanently assigned
- Assignment should prevent conflicting simultaneous custody unless explicitly permitted for shared mode

# 4. UX

Primary screens:

- Asset inventory and assignment queue
- Assignment request and reservation form
- Custody acknowledgment screen
- Kit issue console
- Assignment history and diagnostics view

UX expectations:

- Operations teams should see stock availability, custodian, location, and issue readiness together
- Users should understand what asset is being assigned, under what responsibility, and what acknowledgment is required
- Managers should see cost and approval context for exceptional or high-value requests
- Bulk onboarding issue flows should minimize repetitive clicks while preserving audit quality

# 5. API

Representative APIs:

- `POST /api/v1/asset-management/asset-assignments`
- `GET /api/v1/asset-management/asset-assignments/{assignmentId}`
- `POST /api/v1/asset-management/asset-assignments/{assignmentId}/acknowledge`
- `POST /api/v1/asset-management/asset-assignments/{assignmentId}/transfer`
- `POST /api/v1/asset-management/asset-assignments/kits/issue`
- `GET /api/v1/asset-management/assets/{assetId}/assignment-history`

API expectations:

- Assignment creation must validate asset status, ownership rules, and custodian eligibility
- Acknowledge APIs should capture signature, OTP, or digital acceptance evidence where configured
- Bulk issue APIs should be idempotent and support partial-success handling
- History APIs should expose complete chain-of-custody with timestamps and actors

# 6. Database

Core entities:

- `asset_assignment`
- `asset_assignment_request`
- `asset_custody_acknowledgement`
- `asset_kit_issue`
- `asset_transfer_event`
- `asset_assignment_exception`

Key fields:

- Asset ID, serial number, category, assignment type, status
- Requestor, approver, custodian, cost center, project, location
- Reservation date, issue date, expected return date, temporary-assignment flag
- Acknowledgment method, signature reference, acceptance timestamp
- Exception reason, lost or damage indicator, recovery linkage

Data design expectations:

- Assignment history must remain append-only with transfer and correction events
- Chain-of-custody should be reconstructable at both asset and custodian level
- Kit assignment should preserve child-asset lineage to parent issue request

# 7. Events

Published events:

- `asset_assignment.requested`
- `asset_assignment.reserved`
- `asset_assignment.issued`
- `asset_assignment.acknowledged`
- `asset_assignment.transferred`
- `asset_assignment.exception_opened`

Consumed events:

- `onboarding.case_ready_for_provisioning`
- `employee.transfer.completed`
- `contractor.activated`
- `exit.initiated`

# 8. Reports

Required reports:

- Asset assignment register
- Unacknowledged asset issue report
- Temporary-assignment expiry report
- High-value asset custody report
- Asset assignment exception report

# 9. Dashboards

Operational dashboards:

- Assets awaiting assignment or acknowledgment
- New-joiner kit fulfillment progress
- Temporary assets nearing return date
- Asset concentration by employee or contractor type
- Open issue and exception backlog

# 10. Security

Security requirements:

- Assignment of privileged or security-sensitive assets should require tighter approval and visibility controls
- Custodian identity and location data must follow organizational privacy standards
- Bulk assignment and transfer functions must be restricted to trusted operational roles

# 11. Audit

Audit coverage shall include:

- Assignment request and approval
- Reservation, issue, and acknowledgment events
- Transfer, reassignment, and correction actions
- Exception issue, lost-asset recording, and recovery initiation
- Chain-of-custody views and exports

# 12. AI

AI-assisted opportunities:

- Recommend asset bundle based on role, location, and previous assignment patterns
- Predict assignment delays caused by stock or approval bottlenecks
- Flag unusual custody patterns suggesting misuse or duplicate issue risk

# 13. Test Cases

Core test scenarios:

- Assign available serialized asset to eligible employee
- Block assignment of asset already in active custody
- Issue onboarding asset kit with partial stock availability
- Capture digital acknowledgment successfully
- Transfer asset from one custodian to another with full history preservation

# 14. Workflows

Primary workflow:

1. Assignment need is raised manually or from onboarding or transfer trigger.
2. System validates stock, eligibility, and approval rules.
3. Asset is reserved and issued.
4. Custodian acknowledges receipt and responsibility.
5. Downstream systems consume assignment outcome for support, finance, and exit readiness.

# 15. State Machine

Assignment state model:

- `Requested`
- `Approved`
- `Reserved`
- `Issued`
- `Acknowledged`
- `Transferred`
- `Cancelled`
- `Closed`

# 16. Permissions

Representative permissions:

- `asset_assignment.request`
- `asset_assignment.approve`
- `asset_assignment.issue`
- `asset_assignment.transfer`
- `asset_assignment.history.view`
- `asset_assignment.audit.view`

# 17. Notifications

Notification scenarios:

- Assignment approval requested
- Asset reserved and ready for issue
- Custody acknowledgment pending
- Temporary assignment nearing expiry
- Assignment exception or stock shortage detected

# 18. Configuration

Configurable parameters:

- Approval thresholds by asset category
- Acknowledgment method requirements
- Kit definitions by worker type or role
- Temporary assignment default duration
- Shared or pooled asset rules

# 19. Edge Cases

Important edge cases:

- Employee transfers location after asset reservation but before issue
- Same asset is needed for overlapping onboarding and replacement requests
- Custodian cannot acknowledge digitally and requires offline proof
- Loaner asset is issued while original asset is under repair
