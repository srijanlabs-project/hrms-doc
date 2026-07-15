---
id: HRMS-SUB-26-02
title: Policy assistant Specification
document: 02-policy-assistant.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Policy Assistant governs AI-assisted discovery, summarization, comparison, and explanation of HR policies, rules, and procedural guidance.

In scope:

- Policy question answering
- Document grounding and citation
- Comparison of policy variants by country or population
- Procedural step guidance
- Policy freshness and content governance

# 2. Business

Policy understanding is a constant source of support load and user confusion. A dedicated policy assistant helps employees and managers find accurate guidance quickly without reading long documents manually.

# 3. Functional

The system shall support:

- Semantic search across approved policy corpus
- Response generation grounded in policy text and effective version
- Country, legal entity, and employee-type specific policy branching
- Answers with citations, excerpts, and procedural next steps
- Escalation when answer confidence is low or policy is ambiguous

Validation rules:

- Only approved policy sources shall be used for grounded answers
- Expired or superseded policies shall not be treated as current without explicit labeling
- Jurisdiction-specific policy differences shall be surfaced, not flattened

# 4. UX

The user experience shall provide:

- Search-first and chat-first entry patterns
- Citation panels linked to source document section
- "What applies to me" contextual filters
- Low-confidence and escalation messages that are easy to understand

# 5. API

Representative APIs:

- `POST /api/v1/ai/policy-assistant/query`
- `GET /api/v1/ai/policy-assistant/sources`
- `POST /api/v1/ai/policy-assistant/feedback`
- `POST /api/v1/ai/policy-assistant/escalate`

# 6. Database

Core entities:

- `policy_assistant_query_log`
- `policy_source_index`
- `policy_answer_citation`
- `policy_assistant_feedback`

# 7. Events

The platform shall publish:

- `policy-assistant.query-answered`
- `policy-assistant.low-confidence`
- `policy-assistant.escalated`
- `policy-source.updated`

# 8. Reports

Required reports:

- Policy question volume report
- Low-confidence query report
- Top policy topics report
- Escalation outcome report

# 9. Dashboards

Dashboards shall show:

- Query volume by policy area
- Low-confidence rate
- Unresolved policy gap themes
- Source freshness status

# 10. Security

Security controls shall include:

- Restriction to policy sources user is allowed to access
- Redaction of confidential internal notes
- Safe handling of legal or compliance-sensitive language

# 11. Audit

The audit trail shall capture:

- Source index updates
- Query and answer lineage
- Escalation actions
- Feedback-driven source correction

# 12. AI

AI capabilities may include:

- Retrieval-augmented answers
- Policy summarization
- Difference analysis across policy versions

# 13. Test Cases

- Policy answer cites correct current source
- Country-specific variance is surfaced
- Low-confidence response triggers escalation option
- Superseded policy is labeled correctly if referenced
- Unauthorized policy source is excluded from grounding

# 14. Workflows

1. User submits policy query.
2. Assistant retrieves approved sources.
3. Answer and citations are generated.
4. User accepts guidance or escalates.

# 15. State Machine

- `received`
- `retrieving`
- `answered`
- `low-confidence`
- `escalated`
- `closed`

# 16. Permissions

- Use policy assistant
- Access restricted policy libraries
- Review escalated policy questions
- Manage policy source catalog

# 17. Notifications

- Escalation alerts
- Source freshness alerts
- Feedback review notices

# 18. Configuration

- Approved policy corpus
- Citation formatting
- Confidence thresholds
- Escalation routing

# 19. Edge Cases

- Two policies conflict during transition period
- User asks broad question spanning multiple countries
- Policy source updated mid-conversation
- Query requests legal advice beyond allowed scope
