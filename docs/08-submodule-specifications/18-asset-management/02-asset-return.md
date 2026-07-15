---
id: HRMS-SUB-18-02
title: Asset return Specification
document: 02-asset-return.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Asset Return governs the controlled recovery, inspection, closure, and financial or disciplinary follow-up of assets previously assigned to workforce members.

In scope:

- Return initiation and scheduling
- Physical or logical asset recovery
- Condition assessment and acceptance
- Damage, loss, and recovery linkage
- Exit, transfer, and temporary-loan closure

# 2. Business

Enterprise asset return is critical for security, financial control, stock reuse, and exit clearance. Delayed or undocumented returns create asset leakage, access risks, employee disputes, and inaccurate inventory positions.

Business objectives:

- Recover assigned assets promptly and traceably
- Record return condition and accountability outcome
- Enable reuse, repair, or write-off decisions based on verified asset state
- Support exit, transfer, and temporary-loan closure without manual spreadsheets

Key stakeholders:

- IT and Facilities Operations
- HR Exit Administration
- Finance and Asset Accounting
- Employees and Contractors
- Audit and Security

# 3. Functional

The system shall support:

- Return requests triggered by exit, transfer, replacement, contract end, or manual recovery action
- Scheduled and ad hoc return processes
- Condition capture such as good, damaged, incomplete, not returned, or destroyed
- Accessory tracking including chargers, cases, peripherals, badges, and kits
- Recovery, waiver, repair, refurbishment, or write-off downstream paths
- Partial return, late return, or disputed-return handling
- Return closure only after required items and evidence are captured

Detailed rules:

- Return should validate the active assignment and expected custody set before closure
- Condition assessment may require photo evidence, serial verification, and operator notes
- Lost or damaged items must trigger governed recovery or exception handling rather than silent closure
- Partial returns should keep unresolved items open with clear outstanding obligations
- Security-sensitive assets may require additional wipe, disablement, or certificate-of-return steps

# 4. UX

Primary screens:

- Asset return queue
- Return intake and inspection screen
- Outstanding accessories checklist
- Recovery and exception panel
- Return history and closure view

UX expectations:

- Return operators should see custodian, assignment history, expected kit contents, and urgency in one place
- Employees should receive clear return instructions and proof of submission where applicable
- Exit and HR users should understand whether return blockers affect clearance completion

# 5. API

Representative APIs:

- `POST /api/v1/asset-management/asset-returns`
- `GET /api/v1/asset-management/asset-returns/{returnId}`
- `POST /api/v1/asset-management/asset-returns/{returnId}/inspect`
- `POST /api/v1/asset-management/asset-returns/{returnId}/close`
- `POST /api/v1/asset-management/asset-returns/{returnId}/raise-recovery`
- `GET /api/v1/asset-management/assets/{assetId}/return-history`

API expectations:

- Return creation must verify active assignment or open recovery state
- Inspection APIs should support item-level and kit-level outcome capture
- Close APIs must validate unresolved accessories, recovery decisions, and downstream signals where required

# 6. Database

Core entities:

- `asset_return`
- `asset_return_item`
- `asset_return_inspection`
- `asset_return_exception`
- `asset_recovery_case`
- `asset_condition_evidence`

Key fields:

- Return reference, asset ID, custodian ID, trigger source, due date, actual return date
- Item condition, missing-accessory flag, damage severity, inspector, inspection timestamp
- Recovery amount, waiver flag, approval reference, repair routing
- Proof of return, photo evidence, serial verification result, closure status

Data design expectations:

- Each return should preserve the expected-versus-actual inventory set
- Inspection data should support later disputes, insurance, and recovery workflows
- Return closure should publish lineage back to assignment history and inventory status

# 7. Events

Published events:

- `asset_return.initiated`
- `asset_return.received`
- `asset_return.inspected`
- `asset_return.exception_opened`
- `asset_return.closed`
- `asset_return.recovery_raised`

Consumed events:

- `exit.initiated`
- `employee.transfer.completed`
- `assignment.temporary_expired`
- `asset_assignment.transferred`

# 8. Reports

Required reports:

- Due and overdue asset return report
- Damage and loss report
- Partial return report
- Recovery and waiver report
- Return turnaround report

# 9. Dashboards

Operational dashboards:

- Returns due this week
- Overdue returns by employee type
- Assets awaiting inspection
- Damage and loss trend
- Exit clearances blocked by asset return

# 10. Security

Security requirements:

- Asset condition evidence and recovery outcomes may be sensitive in disciplinary or exit situations
- Return closure and recovery waiver rights should require elevated permissions
- Security-sensitive assets may require restricted visibility and handling paths

# 11. Audit

Audit coverage shall include:

- Return initiation and trigger source
- Inspection and condition changes
- Recovery decisions and waivers
- Partial-return closures and reopen actions
- Inventory-status changes after accepted return

# 12. AI

AI-assisted opportunities:

- Classify likely damage severity from uploaded photos
- Predict overdue return risk by worker type or site
- Suggest probable missing accessories based on assignment history

# 13. Test Cases

Core test scenarios:

- Initiate return from exit process
- Record full return with good-condition inspection
- Handle partial return with missing accessory
- Raise recovery for damaged or lost asset
- Close return and release inventory back to available stock

# 14. Workflows

Primary workflow:

1. Return need is triggered by exit, transfer, replacement, or manual action.
2. System identifies expected assigned items and schedules return.
3. Operations receives, inspects, and records actual return condition.
4. Recovery, repair, or waiver paths execute where needed.
5. Return closes and inventory status is updated.

# 15. State Machine

Return state model:

- `Initiated`
- `Scheduled`
- `Received`
- `Under Inspection`
- `Recovery Pending`
- `Closed`
- `Reopened`

# 16. Permissions

Representative permissions:

- `asset_return.initiate`
- `asset_return.inspect`
- `asset_return.close`
- `asset_return.raise_recovery`
- `asset_return.waive_recovery`
- `asset_return.audit.view`

# 17. Notifications

Notification scenarios:

- Asset return due
- Overdue return reminder
- Damage or recovery action required
- Return completed and accepted
- Exit clearance blocked by missing asset

# 18. Configuration

Configurable parameters:

- Return due-date rules by trigger type
- Inspection evidence requirements
- Damage classification matrix
- Recovery and waiver approval thresholds
- Security wipe or disablement requirements

# 19. Edge Cases

Important edge cases:

- Employee returns asset at a different site from issuing location
- Partial kit return occurs during final exit week
- Asset is physically returned but serial number does not match assignment
- Return is accepted first, then latent damage is discovered later
