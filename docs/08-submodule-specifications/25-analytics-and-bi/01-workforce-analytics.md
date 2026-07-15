---
id: HRMS-SUB-25-01
title: Workforce analytics Specification
document: 01-workforce-analytics.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Workforce Analytics governs the enterprise people metrics layer used to analyze workforce composition, movement, productivity signals, and organizational trends.

In scope:

- Standard workforce KPIs and dimensions
- Headcount, movement, diversity, span, and workforce-cost views
- Time-series and point-in-time reporting
- Drill-down, segmentation, and executive dashboards
- Trusted metric governance and source alignment

# 2. Business

Workforce analytics turns HRMS transactions into management insight. It allows leaders to understand not only how many people exist in the organization, but how workforce shape, movement, and structure are changing over time.

# 3. Functional

The system shall support:

- Standard metrics such as headcount, active employees, hires, exits, internal movement, absenteeism, manager span, vacancy load, and workforce mix
- Dimensions such as legal entity, country, department, grade, job family, gender, tenure, worker type, and location
- Point-in-time and period-based metric calculation
- Drill from enterprise summary to team or employee cohort level where permitted
- Snapshotting and historical trend analysis
- Reconciliation of HR master, payroll, and organizational structure data
- Metric definitions with formula lineage and owner assignment

Validation rules:

- Metrics shall declare source systems and effective-date logic
- Workforce counts shall distinguish employee, contingent, inactive, and future-dated populations consistently
- No dashboard shall mix incompatible point-in-time and period measures without explicit labeling

# 4. UX

The user experience shall provide:

- Executive dashboard view with top metrics and trend indicators
- Analyst exploration view with filters, drill-down, and export
- Metric-definition hover help and data-freshness indicators
- Mobile-friendly summary cards for leadership users

# 5. API

Representative APIs:

- `GET /api/v1/analytics/workforce/metrics`
- `GET /api/v1/analytics/workforce/trends`
- `GET /api/v1/analytics/workforce/drilldown`
- `GET /api/v1/analytics/metric-definitions/{metricCode}`

# 6. Database

Core entities:

- `workforce_metric_definition`
- `workforce_metric_snapshot`
- `workforce_analytics_dimension`
- `workforce_dashboard_view`
- `workforce_analytics_refresh_log`

# 7. Events

The platform shall publish:

- `workforce-analytics.snapshot-generated`
- `workforce-analytics.metric-definition-updated`
- `workforce-analytics.refresh-failed`

# 8. Reports

Required reports:

- Workforce composition report
- Headcount movement report
- Manager span and layer report
- Workforce-cost by structure report

# 9. Dashboards

Dashboards shall show:

- Headcount and movement trends
- Workforce mix by worker type
- Organization structure efficiency indicators
- Regional or business-unit comparison

# 10. Security

Security controls shall include:

- Metric and drill-down access by audience
- Row-level restrictions for population-sensitive views
- Suppression of small cohorts where required by privacy rules

# 11. Audit

The audit trail shall capture:

- Metric-definition changes
- Manual data corrections affecting snapshots
- Sensitive drill-down access and exports

# 12. AI

AI capabilities may include:

- Natural-language summaries of workforce trends
- Outlier detection on sudden workforce changes
- Suggested exploratory breakdowns for analysts

# 13. Test Cases

- Headcount snapshot matches authoritative as-of-date logic
- Drill-down respects row-level security
- Small cohort suppression applies correctly
- Metric formula change versions correctly
- Data-freshness indicator updates after refresh

# 14. Workflows

1. Source data is prepared and refreshed.
2. Workforce metrics are calculated and stored.
3. Dashboards and reports consume governed metrics.
4. Analysts and leaders explore trends and drill-downs.

# 15. State Machine

- `defined`
- `calculated`
- `published`
- `stale`
- `archived`

# 16. Permissions

- View workforce dashboards
- Drill into workforce metrics
- Edit metric definitions
- Export workforce analytics
- Run snapshot refresh

# 17. Notifications

- Refresh-failure alerts
- Metric-definition change notices
- Scheduled executive summary delivery

# 18. Configuration

- Metric catalog
- Dimension model
- Refresh schedules
- Privacy thresholds and audience scopes

# 19. Edge Cases

- Employee counted in multiple assignments
- Future-dated hires included incorrectly in active headcount
- Merged legal entities distort trend comparison
- Cross-border populations need different privacy suppression
