---
id: HRMS-SUB-25-02
title: Attrition analytics Specification
document: 02-attrition-analytics.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Attrition Analytics governs measurement and analysis of employee exits, retention trends, and resignation patterns across the organization.

In scope:

- Voluntary and involuntary attrition metrics
- Exit reason analysis
- Population segmentation and trend analysis
- Regrettable attrition and critical-role loss views
- Early-warning indicators at reporting level

# 2. Business

Attrition is one of the most scrutinized HR outcomes because it affects cost, continuity, leadership confidence, and employer brand. Analytics must distinguish healthy movement from preventable loss.

# 3. Functional

The system shall support:

- Attrition rate calculation by month, quarter, year, and rolling periods
- Segmentation by voluntary, involuntary, retirement, end-of-contract, and internal-transfer exclusions
- Analysis by manager, location, department, grade, tenure, pay band, and critical role
- Exit reason and exit-interview theme mapping
- Regrettable attrition identification through configurable criteria
- Correlation views with engagement, performance, promotion, compensation, and workload signals where permitted

Validation rules:

- Attrition definitions shall declare denominator methodology
- Internal transfer shall not be counted as exit unless configured explicitly
- Regrettable-loss logic shall be versioned and explainable

# 4. UX

The user experience shall provide:

- Trend dashboards with filters and cohort comparisons
- Exit-reason heatmaps and manager comparisons
- Drill from aggregate rate to affected populations
- Clearly labeled definitions and calculation windows

# 5. API

Representative APIs:

- `GET /api/v1/analytics/attrition/rates`
- `GET /api/v1/analytics/attrition/reasons`
- `GET /api/v1/analytics/attrition/cohorts`
- `GET /api/v1/analytics/attrition/regrettable-loss`

# 6. Database

Core entities:

- `attrition_metric_snapshot`
- `attrition_definition_version`
- `exit_reason_analytics_map`
- `attrition_cohort_result`

# 7. Events

The platform shall publish:

- `attrition-analytics.snapshot-generated`
- `attrition-definition.updated`
- `attrition-threshold.breached`

# 8. Reports

Required reports:

- Attrition rate by business unit
- Exit reason report
- Regrettable attrition report
- First-year attrition report

# 9. Dashboards

Dashboards shall show:

- Overall attrition trend
- Voluntary versus involuntary split
- High-attrition managers or teams
- Tenure-based exit pattern

# 10. Security

Security controls shall include:

- Suppression for small employee cohorts
- Limited access to manager-level exit commentary
- Confidential handling of sensitive exit reasons

# 11. Audit

The audit trail shall capture:

- Definition changes
- Manual exit reclassification
- Sensitive exports and drill-down access

# 12. AI

AI capabilities may include:

- Theme extraction from exit comments
- Trend explanation and anomaly detection
- Suggested retention focus areas

# 13. Test Cases

- Internal transfer excluded from attrition numerator
- First-year attrition uses correct service-date logic
- Small-cohort privacy suppression works
- Exit reason recode updates analytics lineage
- Regrettable-loss rule version changes historical comparison labeling

# 14. Workflows

1. Exit transactions and interview data are refreshed.
2. Attrition metrics are calculated.
3. Dashboards surface patterns and risk areas.
4. HR and leadership use outputs for action planning.

# 15. State Machine

- `defined`
- `calculated`
- `published`
- `stale`
- `archived`

# 16. Permissions

- View attrition dashboards
- Drill into attrition cohorts
- Manage attrition definitions
- Export attrition reports

# 17. Notifications

- Threshold-breach alerts
- Scheduled attrition summary delivery
- Data-refresh issue notices

# 18. Configuration

- Attrition formulas
- Exit reason taxonomy
- Regrettable-loss rules
- Privacy suppression thresholds

# 19. Edge Cases

- Mass restructuring distorts normal attrition trend
- Country-specific termination categories differ
- Multiple exit reasons captured for one employee
- Rehire soon after exit affects turnover classification
