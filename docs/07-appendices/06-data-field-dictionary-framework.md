---
id: HRMS-APP-06
title: Data and Field Dictionary Index
document: 06-data-field-dictionary-framework.md
version: 2.0
status: Draft
---

# 1. Purpose

This appendix acts as the master index for canonical entities, fields, and shared data semantics across the Enterprise HRMS platform.

# 2. Primary Detailed References

- [07-entity-ownership-and-module-reference-matrix.md](D:/HRMS-doc/docs/07-appendices/07-entity-ownership-and-module-reference-matrix.md)
- [12-canonical-field-dictionary-seed.md](D:/HRMS-doc/docs/07-appendices/12-canonical-field-dictionary-seed.md)
- [18-field-validation-standards-and-rule-matrix.md](D:/HRMS-doc/docs/07-appendices/18-field-validation-standards-and-rule-matrix.md)
- [19-validation-rule-implementation-traceability-matrix.md](D:/HRMS-doc/docs/07-appendices/19-validation-rule-implementation-traceability-matrix.md)

# 3. Reference Layers

- `Entity layer`
  Canonical business and platform objects with system-of-record ownership.
- `Field layer`
  Canonical field names, types, privacy classes, and engineering notes.
- `Mapping layer`
  Rule-to-field-to-contract-to-screen-to-import mappings derived from the canonical layers.

# 4. Seed Canonical Data Priorities

| Priority Ref | Priority Area | Why It Matters |
|---|---|---|
| `DATA-PR-001` | Tenant and org identifiers | required for tenancy, security, reporting, and integration lineage |
| `DATA-PR-002` | Person and worker identifiers | required for employee and contractor lifecycle consistency |
| `DATA-PR-003` | Effective-dating fields | required for temporal correctness across HR, payroll, and config |
| `DATA-PR-004` | Workflow and audit correlation fields | required for operational traceability and investigations |
| `DATA-PR-005` | Privacy and classification fields | required for masking, export, AI, and governance controls |

# 5. Usage Rules

- new module data models should align to canonical entity and field names unless an exception is documented
- external and legacy field aliases should be mapped explicitly rather than redefining semantics locally
- shared analytics and integration mappings should inherit from these canonical references
