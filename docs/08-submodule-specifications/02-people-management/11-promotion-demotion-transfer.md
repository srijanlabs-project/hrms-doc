---
id: HRMS-SUB-02-11
title: Promotion, demotion, transfer Specification
document: 11-promotion-demotion-transfer.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Promotion, Demotion, and Transfer governs approved employment-structure changes that alter an employee's role, level, manager, location, department, entity, or pay basis.

In scope:

- Promotion and demotion actions
- Department, location, and legal-entity transfers
- Temporary and permanent movement types
- Approval, effective dating, and downstream impact control
- Employee communication and record-history preservation

# 2. Business

Structured employee movement is central to workforce agility. These actions affect compensation, approvals, access rights, reporting, payroll, benefits, and analytics, so they must be tightly orchestrated and historically precise.

Business outcomes:

- Enable controlled talent movement across the enterprise
- Preserve complete history of position and organization changes
- Prevent payroll, security, and reporting mismatches during movement
- Support employee communication and acceptance where required

# 3. Functional

The system shall support:

- Action types such as promotion, demotion, lateral transfer, intercompany transfer, location change, temporary assignment, and return from assignment
- Proposed changes to role, grade, manager, location, cost center, legal entity, FTE, and employment terms
- Effective-date scheduling, future-dating, and conflict detection
- Impact analysis for payroll, compensation, benefits, security roles, hardware, and workspace
- Approval routing by action type, grade change, cost impact, or entity change
- Employee acknowledgment step where policy requires
- Linked generation of revised letters, contracts, or assignment documentation
- Support for both one-step and staged movement workflows

Validation rules:

- Transfer cannot create invalid grade, job, or location combinations
- Intercompany transfer shall enforce destination legal-entity prerequisites
- Temporary assignment shall require end date or return policy where configured
- Pay-impacting movement shall not bypass compensation approvals

# 4. UX

The user experience shall provide:

- HR action wizard showing current and proposed employment state side by side
- Impact summary panel for payroll, manager, and provisioning changes
- Manager and employee task views for approvals and acknowledgments
- Timeline view showing pending, effective, and historical movement events

# 5. API

Representative APIs:

- `POST /api/v1/people/movements`
- `PATCH /api/v1/people/movements/{movementId}`
- `POST /api/v1/people/movements/{movementId}/submit`
- `POST /api/v1/people/movements/{movementId}/acknowledge`
- `GET /api/v1/people/movements/{movementId}/impacts`

API requirements:

- APIs shall expose both requested changes and downstream impact summary
- Movement workflows shall integrate with assignment and compensation services
- Submitted actions shall become version-controlled and audit-safe

# 6. Database

Core entities:

- `employee_movement_case`
- `movement_change_line`
- `movement_approval`
- `movement_impact_record`
- `movement_document_reference`

Key data requirements:

- Movement case shall store source assignment, target assignment, type, and effective date
- Impact records shall capture affected downstream systems and required follow-up tasks
- Approval records shall capture route, decision, and exception rationale

# 7. Events

The platform shall publish:

- `employee.movement.requested`
- `employee.movement.approved`
- `employee.movement.scheduled`
- `employee.movement.effective`
- `employee.transfer.cross-entity`

# 8. Reports

Required reports:

- Employee movement trend report
- Pending movement approval report
- Cross-entity transfer report
- Delayed downstream-completion report

# 9. Dashboards

Dashboards shall show:

- Upcoming movements by date and type
- Movement workload by HRBP or approver
- Downstream task completion for effective movements
- Internal mobility trend by business unit

# 10. Security

Security controls shall include:

- Restriction on initiating high-impact movement types
- Segregation between requestor, approver, and executor roles
- Controlled visibility of compensation and sensitive movement rationale
- Protection against unauthorized backdated actions

# 11. Audit

The audit trail shall capture:

- Original and proposed employment values
- Approval chain and exception decisions
- Effective-date changes and cancellations
- Execution results in downstream systems

# 12. AI

AI capabilities may include:

- Suggested downstream task checklist based on movement type
- Detection of inconsistent proposed movement combinations
- Mobility analytics summaries for talent teams

AI guardrails:

- AI shall not approve or trigger movement autonomously
- Sensitive career-impact decisions remain human controlled

# 13. Test Cases

Minimum test coverage shall include:

- Promotion with compensation impact requires extra approval
- Intercompany transfer blocks until destination prerequisites exist
- Temporary assignment returns employee to prior structure correctly
- Future-dated movement updates assignment on effective date only
- Downstream provisioning task is generated after approval

# 14. Workflows

Primary workflow:

1. Movement request is initiated.
2. System evaluates structural and downstream impacts.
3. Approvals and employee acknowledgment occur as configured.
4. Action becomes effective on scheduled date.
5. Employment, payroll, and access systems are updated and tracked.

# 15. State Machine

Supported states:

- `draft`
- `submitted`
- `under-approval`
- `approved`
- `scheduled`
- `effective`
- `cancelled`
- `completed`

# 16. Permissions

Permissions shall include:

- Initiate movement actions
- Approve movement actions
- View impact analysis
- Execute effective changes
- Cancel or back out scheduled actions

# 17. Notifications

Notifications shall support:

- Approval tasks
- Employee acknowledgment requests
- Pre-effective reminders
- Failed downstream-execution alerts

# 18. Configuration

Administrators shall configure:

- Movement types and allowed field changes
- Approval matrices
- Impact-check rules and downstream task templates
- Document-generation mappings and acknowledgment requirements

# 19. Edge Cases

The design shall address:

- Promotion and location transfer happen in same action
- Employee on leave has future-dated transfer
- Intercompany transfer requires termination and rehire style processing
- Temporary project assignment overlaps pending annual review
- Effective movement is rolled back after downstream payroll already consumed it
