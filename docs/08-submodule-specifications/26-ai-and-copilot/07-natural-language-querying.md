---
id: HRMS-SUB-26-07
title: Natural language querying Specification
document: 07-natural-language-querying.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Natural Language Querying governs the conversion of user questions into governed data queries, reports, and analytic answers over HRMS datasets.

In scope:

- Intent-to-query translation
- Semantic mapping to governed metrics and dimensions
- Query execution and answer rendering
- Guardrails for access, ambiguity, and performance
- Feedback and correction loop

# 2. Business

Natural-language querying broadens access to HR analytics by allowing leaders and HR users to ask business questions directly instead of learning report builders or query syntax.

# 3. Functional

The system shall support:

- Questions about workforce, movement, pay, leave, performance, and similar governed domains
- Mapping of business language to metric catalog, dimensions, and filters
- Clarification prompts when user question is ambiguous
- Execution against approved semantic layer, not unrestricted raw SQL
- Output as summary, table, chart, or suggested saved report

Validation rules:

- Query generation shall respect row-level security and metric definitions
- Ambiguous questions shall request clarification rather than guessing silently when material
- Unsafe or unsupported queries shall fail with explanation and fallback guidance

# 4. UX

The user experience shall provide:

- Prompt input with example questions
- Generated interpretation preview
- Clarification follow-up flow
- Result cards with metric definition and filters used

# 5. API

Representative APIs:

- `POST /api/v1/ai/nlq/query`
- `POST /api/v1/ai/nlq/clarify`
- `GET /api/v1/ai/nlq/history`
- `POST /api/v1/ai/nlq/feedback`

# 6. Database

Core entities:

- `nlq_request`
- `nlq_interpretation`
- `nlq_result_snapshot`
- `nlq_feedback`

# 7. Events

The platform shall publish:

- `nlq.query-submitted`
- `nlq.clarification-requested`
- `nlq.query-completed`
- `nlq.query-rejected`

# 8. Reports

Required reports:

- NLQ usage report
- Clarification rate report
- Query rejection report
- Result accuracy feedback report

# 9. Dashboards

Dashboards shall show:

- Question volume by domain
- Clarification and rejection trend
- Top requested metrics
- User satisfaction trend

# 10. Security

Security controls shall include:

- Semantic-layer enforcement with row-level security
- Prevention of raw unrestricted query generation
- Logging of sensitive analytic access
- Guardrails against prompt attempts to bypass data policy

# 11. Audit

The audit trail shall capture:

- User question
- Interpreted semantic query
- Result filters and security scope
- Feedback or correction outcomes

# 12. AI

AI capabilities may include:

- Intent parsing
- Semantic mapping
- Result explanation and follow-up suggestion

# 13. Test Cases

- Ambiguous query asks clarifying question
- Restricted metric not returned to unauthorized user
- Result includes filters and metric definitions used
- Unsupported question returns safe fallback
- Feedback links to original interpretation record

# 14. Workflows

1. User asks business question.
2. NLQ service interprets intent and semantic mapping.
3. Query executes against governed layer.
4. Result is presented or clarification requested.

# 15. State Machine

- `received`
- `interpreted`
- `clarification-needed`
- `executed`
- `rejected`
- `closed`

# 16. Permissions

- Use NLQ
- View sensitive analytic outputs
- Access NLQ history
- Review NLQ feedback

# 17. Notifications

- Query completion notices for long-running requests
- Rejection explanations
- Feedback follow-up messages

# 18. Configuration

- Semantic catalog
- Clarification thresholds
- Query cost limits
- Allowed output formats

# 19. Edge Cases

- User asks combined metrics with conflicting time grains
- Same phrase maps to different metrics across tenants
- Query result too large for interactive response
- Semantic layer updated between question and rerun
