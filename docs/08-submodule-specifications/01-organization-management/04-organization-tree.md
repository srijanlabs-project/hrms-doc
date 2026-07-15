---
id: HRMS-SUB-01-04
title: Organization tree Specification
document: 04-organization-tree.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Organization Tree governs the hierarchical structure of the enterprise across nodes such as company, legal entity, business unit, function, region, department, and other configured structures used for reporting, workflow, visibility, and analytics.

In scope:

- Hierarchy modeling and node relationships
- Effective-dated organization changes
- Structural reporting and navigation
- Access, workflow, and analytics dependency support
- Reorganization and restructuring governance

# 2. Business

The organization tree is one of the core navigational and control structures of the HRMS platform. It influences manager visibility, approval routing, headcount analytics, cost and workforce reporting, talent reviews, and internal service ownership.

Business objectives:

- Provide a consistent enterprise structure for operational and reporting use
- Support reorganizations without losing historical reporting context
- Enable workflow, access, and analytics features to resolve hierarchy accurately
- Give leaders clear visibility into current and historical organization shape

# 3. Functional

The system shall support:

- Multi-level hierarchical nodes with configurable node types
- Parent-child relationships, sibling order, and hierarchy depth rules
- Effective-dated node creation, moves, merges, splits, and closures
- Structural versions or snapshots for historical reporting where required
- Multiple derived trees or views if the operating model supports parallel reporting structures
- Rollup of population, cost, and metrics through hierarchy levels

Detailed rules:

- Structural changes should preserve historical reporting context and not rewrite prior periods silently
- Node moves and merges must identify impacted employees, managers, roles, and policies before activation
- Parallel structures such as functional vs geographic hierarchies should be explicit if supported
- Cycles or invalid parentage must be blocked by validation
- Hierarchy changes may trigger downstream recalculation for approvals, access scope, or analytics
- Structural snapshots should support both point-in-time reporting and approved future-state planning where configured
- Node metadata should support confidential future-state reorg visibility independent of current-state visibility

# 4. UX

Primary screens:

- Organization tree explorer
- Node detail and edit screen
- Reorganization impact simulator
- Historical hierarchy snapshot viewer

UX expectations:

- Admins should navigate and edit complex hierarchies visually and safely
- Leaders should consume the structure in understandable business terms
- Simulation views should expose downstream population and process impact before applying structural changes

# 5. API

Representative APIs:

- `POST /api/v1/org/tree/nodes`
- `PUT /api/v1/org/tree/nodes/{nodeId}`
- `POST /api/v1/org/tree/nodes/{nodeId}/move`
- `POST /api/v1/org/tree/reorganizations/simulate`
- `GET /api/v1/org/tree/current`
- `GET /api/v1/org/tree/snapshots/{snapshotId}`

# 6. Database

Core entities:

- `org_node`
- `org_node_relationship`
- `org_tree_snapshot`
- `org_reorganization_event`
- `org_node_type`
- `org_hierarchy_validation_result`

Key fields:

- Node ID, node code, node type, name, status, effective dates
- Parent node, child node, relationship type, sort order
- Snapshot date, snapshot reason, structure version
- Reorganization change set, impacted population count, approval reference
- Validation status, cycle-detection result, policy-impact indicator
- Visibility scope, future-state indicator, confidential-planning flag
- Rollup-cost total, rollup-headcount total, analytics-export token

# 7. Events

Published events:

- `org_node.created`
- `org_node.updated`
- `org_tree.changed`
- `org_tree.snapshot_created`
- `org_reorganization.approved`

Consumed events:

- `company.activated`
- `legal_entity.updated`
- `manager.assignment_changed`
- `analytics.snapshot_requested`

# 8. Reports

Required reports:

- Organization hierarchy report
- Population rollup by node report
- Reorganization impact report
- Historical structure comparison report
- Invalid hierarchy exception report
- Future-state planning report
- Hierarchy visibility-scope and confidential-node report

# 9. Dashboards

Operational dashboards:

- Current organization shape summary
- Nodes with unresolved structural issues
- Reorganization pipeline
- Headcount and cost rollup by top nodes

# 10. Security

Security requirements:

- Structural editing should be limited to trusted organization administrators
- Some hierarchy views may require restricted visibility in confidential reorganization scenarios
- Historical structure snapshots should be protected from destructive overwrite

# 11. Audit

Audit coverage shall include:

- Node creation and updates
- Parent-child changes and moves
- Reorganization approval and activation
- Snapshot creation and historical retrieval
- Impact simulations and override decisions

# 12. AI

AI-assisted opportunities:

- Predict downstream impact of proposed reorganizations
- Detect hierarchy anomalies or unusually complex structures
- Summarize structural change effects for leadership review

AI guardrails:

- AI structural recommendations must not activate reorganizations or rewrite node history
- Confidential future-state nodes should remain masked in summaries for unauthorized viewers

# 13. Test Cases

Core test scenarios:

- Create valid hierarchy node and link to parent
- Block cyclic parent-child relationship
- Move node and simulate downstream impact
- Preserve historical snapshot after reorganization
- Recalculate dependent approval or reporting paths after activation
- Maintain distinct visibility for future-state confidential reorg node
- Export current and historical hierarchy without mutating live structure

# 14. Workflows

Primary workflow:

1. Admin creates or updates structural nodes.
2. System validates hierarchy integrity and downstream impact.
3. Reorganization changes are simulated and approved.
4. New structure is activated and snapshotted.
5. Downstream modules consume the updated hierarchy.

# 15. State Machine

Node state model:

- `Draft`
- `Active`
- `Inactive`
- `Merged`
- `Retired`

# 16. Permissions

Representative permissions:

- `org_tree.edit`
- `org_tree.move`
- `org_tree.simulate`
- `org_tree.snapshot.view`
- `org_tree.confidential.view`
- `org_tree.audit.view`

# 17. Notifications

Notification scenarios:

- Reorganization simulation completed
- Structural change awaiting approval
- Invalid hierarchy relationship detected
- New snapshot created after activation

# 18. Configuration

Configurable parameters:

- Allowed node types
- Maximum hierarchy depth
- Parallel-structure support
- Snapshot frequency
- Reorganization approval workflow

# 19. Edge Cases

Important edge cases:

- Reorganization spans multiple companies and legal entities
- Historical reporting requires old and new structures in the same year
- Node merge leaves unresolved duplicate downstream references
- Confidential reorg should be modeled before broad visibility is allowed
