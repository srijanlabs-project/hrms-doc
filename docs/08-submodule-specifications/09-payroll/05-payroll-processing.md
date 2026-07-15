---
id: HRMS-SUB-09-05
title: Payroll processing Specification
document: 05-payroll-processing.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Payroll Processing is the controlled execution of the payroll run from validated inputs through gross-to-net results, exception handling, approvals, and close-ready outputs.

In scope:

- Payroll run creation
- Input consolidation
- Calculation execution
- Validation and exception review
- Result generation
- Approval and close-readiness

# 2. Business Context

Payroll processing is one of the highest-risk operational areas in HRMS because errors directly affect employee pay, finance accuracy, compliance posture, and trust in the system.

Business outcomes:

- Produce accurate payroll results for each period
- Detect and resolve pay-impacting issues before close
- Preserve traceability from source inputs to final payslip components
- Support timely and compliant payroll completion

# 3. Actors and Responsibilities

Primary roles:

- Payroll Processor
- Payroll Approver
- HR Operations
- Finance Reviewer
- Auditor

Responsibilities:

- Payroll Processor executes run preparation, calculation, and exception resolution
- Payroll Approver authorizes close-ready outcome
- HR Operations resolves upstream employee-data issues
- Finance Reviewer validates cost and posting impact where required
- Auditor reviews control and evidence completeness

# 4. Functional Behavior

The system shall support:

- Period and company scoped payroll run creation
- Input load from attendance, leave, compensation, loans, advances, claims, and manual adjustments
- Component calculation sequence and dependency handling
- Exception detection before and after calculation
- Gross-to-net result generation
- Recalculation after corrected inputs
- Approval and closure preparation

Detailed processing capabilities:

- Freeze or snapshot run inputs for reproducibility
- Support rerun at employee or run level depending on policy
- Separate blocking vs non-blocking payroll exceptions
- Support off-cycle and supplementary runs where configured
- Track result lineage for each component

# 5. Data and Field Design

Core entities:

- `payroll_run`
- `payroll_run_scope`
- `payroll_input_snapshot`
- `payroll_component_result`
- `payroll_exception`
- `payroll_recalculation_event`

Important field groups:

- Payroll period and company scope
- Input source identifiers and snapshots
- Employee processing status
- Gross, deductions, net, statutory totals
- Exception code, severity, and resolution state
- Approval and close metadata

# 6. UX and Interaction Model

Primary screens:

- Payroll run cockpit
- Input readiness dashboard
- Exception workbench
- Employee result drill-down
- Approval and close screen

UX expectations:

- Payroll processors should see run progression in a clear sequence
- Blocking exceptions should be highlighted above informational warnings
- Drill-down should expose source values, rule references, and final component results
- Recalculation actions should clearly indicate impact scope

# 7. API and Service Contracts

Representative APIs:

- `POST /api/v1/payroll/runs`
- `POST /api/v1/payroll/runs/{runId}/freeze-inputs`
- `POST /api/v1/payroll/runs/{runId}/process`
- `GET /api/v1/payroll/runs/{runId}/exceptions`
- `POST /api/v1/payroll/runs/{runId}/recalculate`

API expectations:

- Run processing must be idempotent for the same frozen input state
- Exception APIs must expose severity and resolution dependency
- Recalculation APIs must state whether impact is employee-level or run-level

# 8. Workflow and Business Rules

Typical workflow:

1. Payroll run is created for period and scope.
2. Inputs are validated and frozen or snapshotted.
3. Calculation engine processes employees and components.
4. Blocking exceptions are resolved.
5. Payroll results are reviewed and approved.
6. Run moves to close-ready and downstream output stage.

Critical rules:

- No payroll close without resolved blocking exceptions
- No silent recalculation after approval
- No result mutation without traceable rerun or adjustment path
- Off-cycle run logic must remain distinct from normal-cycle logic

# 9. State Machine

Run states:

- Created
- Inputs Ready
- Processing
- Processed with Exceptions
- Processed
- Approval Pending
- Approved
- Close Ready
- Closed

# 10. Events and Notifications

Published events:

- `payroll.run.created`
- `payroll.inputs.frozen`
- `payroll.processing.completed`
- `payroll.exception.detected`
- `payroll.run.approved`

Notifications:

- Processing completed with blocking exceptions
- Payroll ready for approval
- Approval rejected or sent back
- Close deadline risk

# 11. Reports and Dashboards

Reports:

- Payroll run summary
- Exception report
- Employee-level result sheet
- Variance report vs prior run

Dashboards:

- Processing progress by employee count
- Blocking exceptions by category
- Company-level payroll cost snapshot
- Approval and close readiness

# 12. Security, Permissions, and Audit

Security requirements:

- Processing, approval, and close actions must be separated by role where policy requires
- Sensitive compensation values must be restricted to authorized payroll users
- Export rights for detailed payroll results must be tightly controlled

Audit requirements:

- Run creation and scope
- Input freeze state
- Every recalculation
- Exception resolution actions
- Approval and send-back actions
- Final result release reference

# 13. Configuration

Configurable items:

- Processing calendar
- Company and employee inclusion rules
- Blocking exception thresholds
- Recalculation policy
- Approval rules
- Off-cycle run enablement

# 14. Edge Cases and Exception Handling

- Attendance finalized after input freeze
- Employee salary revision posted mid-run
- Duplicate payroll input from upstream source
- Employee transfer across entities in same payroll period
- Run approved and then corrected input discovered

# 15. Test Scenarios

- Full payroll processing for normal period
- Blocking exception halts close
- Recalculation after corrected input
- Off-cycle run processing
- Employee-level rerun if supported
- Audit verification for result lineage

# 16. Dependencies and Integrations

Dependencies:

- People Management
- Attendance
- Leave Management
- Compensation and Benefits
- Workflow engine

Integrations:

- Banking output preparation
- Statutory engine
- Finance posting
- Payslip generation

# 17. Assumptions

- Upstream data has formal finalization checkpoints
- Calculation logic is maintained outside the simple UI layer
- Result lineage is mandatory for audit and support
