---
id: HRMS-SUB-26-04
title: Flight risk prediction Specification
document: 04-flight-risk-prediction.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Flight Risk Prediction governs short-horizon predictive assessment of employees who may be at elevated near-term departure risk.

In scope:

- Near-term risk scoring
- Hotspot and priority ranking
- Explainability and intervention support
- Governance distinct from general attrition prediction
- Monitoring and fairness controls

# 2. Business

Flight-risk models focus on immediate retention risk rather than broad long-term attrition. They are sensitive because they may influence manager behavior quickly and must be used responsibly.

# 3. Functional

The system shall support:

- Short-horizon risk scoring using approved near-term signals
- Prioritization by urgency, confidence, and business criticality
- Explanation of current risk drivers at high level
- Team hotspot reporting and case creation for retention review
- Separate monitoring from long-horizon attrition model

Validation rules:

- Flight-risk access shall be limited to approved retention stakeholders
- Rapidly changing scores shall preserve history and freshness indicators
- Model shall not recommend employment action directly

# 4. UX

The user experience shall provide:

- Retention-risk dashboard
- Freshness and urgency labels
- Action-planning links with controlled note capture
- Clear caution messaging on responsible use

# 5. API

Representative APIs:

- `GET /api/v1/ai/flight-risk/scores`
- `POST /api/v1/ai/flight-risk/rescore`
- `GET /api/v1/ai/flight-risk/monitoring`
- `POST /api/v1/ai/flight-risk/interventions`

# 6. Database

Core entities:

- `flight_risk_score`
- `flight_risk_explanation`
- `flight_risk_intervention_case`
- `flight_risk_monitoring_result`

# 7. Events

The platform shall publish:

- `flight-risk.score-generated`
- `flight-risk.high-risk-identified`
- `flight-risk.intervention-opened`
- `flight-risk.drift-detected`

# 8. Reports

Required reports:

- High-risk population report
- Intervention outcome report
- Score freshness report
- Governance access report

# 9. Dashboards

Dashboards shall show:

- Near-term hotspot teams
- New high-risk cases
- Monitoring status
- Intervention conversion trend

# 10. Security

Security controls shall include:

- Restricted audience and need-to-know controls
- Logging of score access and intervention creation
- Suppression of score visibility where jurisdiction disallows

# 11. Audit

The audit trail shall capture:

- Score generation
- Access to individual risk views
- Intervention decisions
- Model policy changes

# 12. AI

AI capabilities may include:

- Short-horizon risk scoring
- Prioritization and explanation
- Intervention effectiveness pattern analysis

# 13. Test Cases

- Score freshness indicator updates on rescore
- Unauthorized role blocked from access
- High-risk threshold event emitted
- Intervention case links correctly to employee context
- Jurisdiction policy suppresses individual view when configured

# 14. Workflows

1. Near-term signals are scored.
2. High-risk results are reviewed.
3. Intervention case may be created.
4. Monitoring and governance continue over time.

# 15. State Machine

- `generated`
- `reviewable`
- `suppressed`
- `intervention-open`
- `stale`
- `retired`

# 16. Permissions

- View flight-risk dashboard
- View individual flight-risk score
- Create intervention case
- Trigger rescore
- View monitoring

# 17. Notifications

- New high-risk case alerts
- Stale score alerts
- Monitoring drift alerts

# 18. Configuration

- Risk thresholds
- Freshness windows
- Access scope
- Intervention routing

# 19. Edge Cases

- Employee marked high risk immediately after accepted promotion
- Score volatility from incomplete data feed
- Team manager should not see score due to governance restriction
- Retention action already in progress before score refresh
