---
id: HRMS-APP-32
title: Event Schema Callback and Consumer Test Pack
document: 32-event-schema-callback-and-consumer-test-pack.md
version: 1.0
status: Draft
---

# 1. Purpose

This appendix closes the event and webhook depth gap by defining required event schema packs, provider callback contract rules, and consumer contract test expectations.

# 2. Required Event Schema Pack List

The following event families must each have a JSON schema pack:

- tenant lifecycle
- employee lifecycle
- requisition and offer lifecycle
- leave request lifecycle
- attendance correction
- payroll run lifecycle
- document generation and signature lifecycle
- workflow task lifecycle
- notification failure lifecycle
- support-session lifecycle

# 3. Provider Callback Contract Rules

Provider callbacks must declare:

- callback endpoint
- signature validation rule
- replay window
- dedupe key
- error response behavior
- retry posture

Required callback families:

- signature provider callback
- malware scan callback
- webhook delivery callback
- notification provider callback

# 4. Consumer Contract Tests

Every important consumer should have tests for:

- valid version accepted
- unsupported major version rejected
- duplicate event deduped
- replay flagged as replay
- masked payload fields handled safely
- callback signature verified

