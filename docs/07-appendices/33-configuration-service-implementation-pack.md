---
id: HRMS-APP-33
title: Configuration Service Implementation Pack
document: 33-configuration-service-implementation-pack.md
version: 1.0
status: Draft
---

# 1. Purpose

This appendix closes the remaining configuration-runtime depth gap by defining concrete API families, physical entities, admin surfaces, drift controls, and service-consumption rules.

# 2. Concrete API Families

- `GET /api/v1/platform/config/definitions`
- `GET /api/v1/platform/config/effective`
- `POST /api/v1/platform/config/changes`
- `POST /api/v1/platform/config/publish`
- `POST /api/v1/platform/config/rollback`
- `GET /api/v1/platform/config/drift`

# 3. Physical Entities

- `config_definition`
- `config_value_entry`
- `config_value_version`
- `config_publish_batch`
- `config_scope_resolution_cache`
- `config_secret_reference`

# 4. Admin Surfaces Required

- definition catalog
- scope compare view
- publish approval console
- rollback history view
- environment drift monitor

# 5. Drift Control Rules

Drift reporting must compare:

- lower environment versus production
- provider default versus tenant overrides
- expected publish batch versus effective active values

# 6. Service Consumption Rule

All services must consume effective values through:

- config resolver API
- signed cache snapshot
- event-driven refresh

Direct raw-scope table reads by domain services are prohibited as a target-state pattern.

