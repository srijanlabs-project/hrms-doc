---
id: HRMS-XCUT-15
title: Search Architecture and Security Trimming
document: 15-search-architecture-and-security-trimming.md
version: 1.0
status: Draft
---

# 1. Purpose

This document defines the shared search architecture for the HRMS platform, including indexing patterns, relevance, tenant isolation, and security trimming.

# 2. Scope

This standard applies to:

- cross-entity global search
- domain-specific search lists
- admin and provider search consoles
- search projections and reindex operations

# 3. Search Model

Search should operate on indexed projections rather than direct operational table scans for enterprise-scale use cases.

Projection families:

- people
- recruitment
- workflow tasks
- documents
- cases
- platform objects

# 4. Indexing Rules

- source services own search document publication for their entities
- search documents must carry tenant, object type, object ID, business key, status, and security scope tags
- high-risk data should index only safe summary fields unless privileged projection is explicitly justified

# 5. Security Trimming

Search results must be filtered by:

- tenant
- role and permission
- org scope
- manager scope
- support-session scope
- object-state visibility

Provider-side cross-tenant search should be separate from org-side search behavior.

# 6. Relevance and Ranking

Ranking inputs may include:

- exact ID or code match
- prefix match
- role relevance
- recent activity
- object status

Do not rank unauthorized but near-matching records and then hide them in a way that leaks existence.

# 7. Reindex Strategy

Support:

- single-object reindex
- tenant-scope reindex
- index-family rebuild
- backfill after schema evolution

Reindex operations must be job-orchestrated and auditable.

# 8. Runtime APIs

- `GET /api/v1/search`
- `POST /api/v1/search/reindex/object`
- `POST /api/v1/search/reindex/tenant`
- `GET /api/v1/search/health`

# 9. Test Expectations

- tenant leakage blocked
- manager-scope filtering works
- provider support search requires governed support context
- deleted or archived object visibility follows policy
- reindex after schema change preserves security tags

