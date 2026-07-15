---
id: HRMS-SUB-22-02
title: Risk assessments Specification
document: 02-risk-assessments.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Risk Assessments governs the identification, evaluation, mitigation, approval, and review of workplace hazards and operational risks across sites, roles, equipment, and activities.

In scope:

- Hazard identification
- Risk scoring and control evaluation
- Mitigation planning
- Review and sign-off cycles
- Linkage to incidents, training, and compliance controls

# 2. Business

Risk assessments help the organization proactively prevent incidents instead of reacting after harm occurs. They also provide a structured record of hazard awareness, control design, and management accountability.

Business objectives:

- Identify and prioritize workplace and operational hazards
- Standardize assessment methodology across sites and functions
- Ensure mitigation actions are assigned, tracked, and reviewed
- Feed preventive insight into training, safety, and compliance programs

# 3. Functional

The system shall support:

- Assessments for site, activity, equipment, role, event, and process contexts
- Risk-scoring frameworks such as likelihood x impact or configurable matrices
- Inherent risk, control effectiveness, and residual risk capture
- Preventive and corrective mitigation actions with ownership and due dates
- Review, approval, periodic reassessment, and change-triggered reassessment
- Attachment of site photos, inspection findings, and external standards references

Detailed rules:

- Critical residual-risk outcomes may require leadership or EHS sign-off before activity continues
- Assessments should support draft, review, approved, and obsolete versions
- Mitigation actions should remain linked to the assessment that created them
- Changes in equipment, site conditions, or regulations should be able to trigger reassessment workflows
- Site-local control libraries should be reusable while preserving approval of the final applied assessment
- Temporary emergency controls should be clearly marked distinct from long-term mitigations

# 4. UX

Primary screens:

- Risk assessment register
- Hazard and control matrix editor
- Residual-risk dashboard
- Mitigation action tracker
- Review-cycle planner

UX expectations:

- Assessors should capture risks in a structured, repeatable format
- Site managers should understand top risks and overdue controls quickly
- Review interfaces should make it easy to compare prior and current assessments

# 5. API

Representative APIs:

- `POST /api/v1/ehs/risk-assessments`
- `GET /api/v1/ehs/risk-assessments/{assessmentId}`
- `POST /api/v1/ehs/risk-assessments/{assessmentId}/score`
- `POST /api/v1/ehs/risk-assessments/{assessmentId}/approve`
- `POST /api/v1/ehs/risk-assessments/{assessmentId}/actions`
- `POST /api/v1/ehs/risk-assessments/{assessmentId}/review`

# 6. Database

Core entities:

- `risk_assessment`
- `risk_hazard`
- `risk_control`
- `risk_mitigation_action`
- `risk_review_cycle`
- `risk_scoring_model`

Key fields:

- Assessment ID, assessment scope, site, owner, status, review date
- Hazard category, likelihood, impact, inherent risk score
- Control type, effectiveness rating, residual risk score
- Mitigation owner, due date, completion status
- Approval authority, sign-off timestamp, reassessment trigger
- Residual-risk override reason, critical-operation flag, and review committee reference
- Linked incident count and inspection-source reference

# 7. Events

Published events:

- `risk_assessment.created`
- `risk_assessment.approved`
- `risk_assessment.reassessment_due`
- `risk_assessment.high_residual_risk_detected`
- `risk_mitigation_action_created`

Consumed events:

- `incident.closed`
- `equipment.installed`
- `site.rule_changed`
- `compliance_training.overdue`

# 8. Reports

Required reports:

- Risk assessment register
- High residual risk report
- Mitigation completion report
- Reassessment due report
- Site hazard trend report
- Control-library reuse report
- Residual-risk override report

# 9. Dashboards

Operational dashboards:

- High-risk sites or activities
- Overdue mitigation actions
- Assessments pending approval
- Reassessment pipeline
- Control-effectiveness trends

# 10. Security

Security requirements:

- Assessment content may reveal site vulnerabilities and should be scope-controlled
- Approval and scoring-model changes should be restricted to authorized EHS roles
- External auditors may receive read-only access for approved assessment sets only

# 11. Audit

Audit coverage shall include:

- Risk-score and control changes
- Mitigation owner and due-date changes
- Approval and reassessment actions
- Scoring-model revisions
- Sensitive report exports

# 12. AI

AI-assisted opportunities:

- Suggest likely hazards from site, role, or equipment context
- Highlight mitigation actions most likely to reduce residual risk
- Detect recurring risk themes across incidents and assessments

AI guardrails:

- AI hazard suggestions must not replace formal assessor accountability
- Residual-risk recommendations should expose why the suggested score differs from user input

# 13. Test Cases

Core test scenarios:

- Create assessment and score inherent vs residual risk
- Trigger approval requirement for high residual risk
- Add mitigation actions and track completion
- Reassess after incident or process change
- Compare current assessment with prior approved version
- Apply temporary control and preserve distinction from permanent mitigation
- Trigger reassessment after regulatory threshold change

# 14. Workflows

Primary workflow:

1. Assessor creates risk assessment.
2. Hazards and controls are captured and scored.
3. Residual risk is reviewed and approved if required.
4. Mitigation actions are tracked.
5. Assessment is periodically or event-driven reviewed.

# 15. State Machine

Assessment state model:

- `Draft`
- `Under Review`
- `Approved`
- `Mitigation Active`
- `Reassessment Due`
- `Obsolete`

# 16. Permissions

Representative permissions:

- `risk_assessment.create`
- `risk_assessment.edit`
- `risk_assessment.approve`
- `risk_assessment.mitigation.manage`
- `risk_assessment.view_sensitive`
- `risk_assessment.audit.view`

# 17. Notifications

Notification scenarios:

- Assessment awaiting approval
- High residual risk detected
- Mitigation action overdue
- Reassessment due
- Scoring model changed

# 18. Configuration

Configurable parameters:

- Scoring methodology
- Approval thresholds
- Review cadence
- Hazard taxonomy
- Mitigation templates

# 19. Edge Cases

Important edge cases:

- Same hazard appears in overlapping site and process assessments
- Control is marked effective but incident evidence suggests otherwise
- Emergency temporary control is applied before permanent mitigation exists
- Regulatory update changes acceptable residual risk threshold
