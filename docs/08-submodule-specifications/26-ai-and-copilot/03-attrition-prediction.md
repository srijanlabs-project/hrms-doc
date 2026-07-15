---
id: HRMS-SUB-26-03
title: Attrition prediction Specification
document: 03-attrition-prediction.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Attrition Prediction governs predictive scoring and explanation of likelihood that employees or cohorts may exit the organization.

In scope:

- Individual and cohort attrition scoring
- Feature governance and explainability
- Risk segmentation and intervention support
- Monitoring of drift, bias, and false positives
- Controlled presentation to authorized users

# 2. Business

Attrition prediction helps leaders focus retention effort earlier, but it must remain explainable, fair, and carefully limited because it affects employee trust and management behavior.

# 3. Functional

The system shall support:

- Scheduled or event-driven attrition risk scoring
- Feature inputs from approved HR, payroll, performance, movement, and engagement signals
- Risk bands, confidence values, and contributing factor summaries
- Team and cohort trend views
- Integration to retention planning workflows and analytics

Validation rules:

- Protected or prohibited attributes shall be controlled per approved model policy
- Scores shall expire or be refreshed under defined cadence
- Users shall not see prediction output without appropriate business role and training if required

# 4. UX

The user experience shall provide:

- Risk dashboard for authorized HR and leadership users
- Cohort views before individual views where policy prefers aggregate-first usage
- Contributing-factor explanation panel
- Intervention planning links

# 5. API

Representative APIs:

- `GET /api/v1/ai/attrition-prediction/scores`
- `GET /api/v1/ai/attrition-prediction/cohorts`
- `POST /api/v1/ai/attrition-prediction/rescore`
- `GET /api/v1/ai/attrition-prediction/monitoring`

# 6. Database

Core entities:

- `attrition_prediction_score`
- `attrition_prediction_feature_snapshot`
- `attrition_prediction_explanation`
- `attrition_prediction_monitoring_result`

# 7. Events

The platform shall publish:

- `attrition-prediction.score-generated`
- `attrition-prediction.model-drift-detected`
- `attrition-prediction.threshold-breached`

# 8. Reports

Required reports:

- Risk distribution report
- Model accuracy report
- Bias and fairness review report
- Intervention outcome correlation report

# 9. Dashboards

Dashboards shall show:

- High-risk cohort trend
- Score freshness
- Drift and monitoring health
- Intervention coverage

# 10. Security

Security controls shall include:

- Strict role-based access
- No exposure to general managers where policy disallows
- Logging of access to individual risk scores
- Clear separation of prediction from adverse employment action workflows

# 11. Audit

The audit trail shall capture:

- Score generation runs
- Model version used
- Access to individual scores
- Intervention workflow linkage

# 12. AI

AI capabilities may include:

- Predictive risk scoring
- Contributing factor ranking
- Cohort anomaly detection

# 13. Test Cases

- Score includes model version and timestamp
- Unauthorized role cannot access individual score
- Expired scores are marked stale
- Monitoring alert fires on drift threshold
- Cohort aggregate hides individual identities when configured

# 14. Workflows

1. Approved feature set is scored.
2. Risk output is stored and monitored.
3. Authorized users review cohort or individual risk.
4. Retention planning may be initiated.

# 15. State Machine

- `generated`
- `published`
- `stale`
- `suppressed`
- `retired`

# 16. Permissions

- View attrition risk dashboard
- View individual attrition risk
- Trigger rescore
- View model monitoring
- Manage intervention mappings

# 17. Notifications

- High-risk cohort alerts
- Drift and stale-score alerts
- Rescore completion notices

# 18. Configuration

- Risk bands
- Refresh cadence
- Access scopes
- Intervention workflow hooks

# 19. Edge Cases

- Employee recently resigned but score still active
- Feature data delayed causing misleading result
- Reorganization changes team risk distribution abruptly
- Country restricts use of individual-level predictive output
