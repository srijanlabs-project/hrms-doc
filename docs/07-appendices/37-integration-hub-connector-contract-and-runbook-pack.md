---
id: HRMS-APP-37
title: Integration Hub Connector Contract and Runbook Pack
document: 37-integration-hub-connector-contract-and-runbook-pack.md
version: 1.0
status: Draft
---

# 1. Purpose

This appendix closes the integration-runtime depth gap by defining connector-specific contract families, physical entities, and concrete runbook expectations.

# 2. Connector Contract Families

Required connector families:

- REST pull or push connector
- webhook outbound connector
- webhook inbound connector
- file drop or SFTP connector
- identity-provider connector
- biometric-device connector
- ERP or payroll downstream connector

# 3. Contract Schema Requirements

Every connector contract should define:

- source payload schema
- target payload schema
- mapping rules
- idempotency key
- retry profile
- error classifications
- replay safety note

# 4. Physical Entities

- `integration_connector`
- `integration_contract_version`
- `integration_run`
- `integration_message`
- `integration_dead_letter`
- `integration_credential_reference`

# 5. Recovery Runbook Families

- connector authentication failure
- schema drift
- dead-letter replay
- watermark correction
- remote throttling or `429`
- partial batch replay

