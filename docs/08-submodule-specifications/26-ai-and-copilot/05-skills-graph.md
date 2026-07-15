---
id: HRMS-SUB-26-05
title: Skills graph Specification
document: 05-skills-graph.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Skills Graph governs the structured representation of skills, proficiencies, relationships, evidence, and role alignment across the workforce.

In scope:

- Skill taxonomy and ontology
- Skill-to-person, role, learning, and job mappings
- Evidence and proficiency modeling
- Inference, normalization, and updates
- Consumption by mobility, learning, and planning use cases

# 2. Business

The skills graph helps the HRMS move from static job labels to a capability-based workforce model, enabling better mobility, learning, recruiting, and planning decisions.
The skills graph should also support talent-to-project matching and project-staffing recommendations where organizations use the platform for internal staffing visibility.

# 3. Functional

The system shall support:

- Skill entities, aliases, categories, and hierarchical relationships
- Proficiency levels, recency, confidence, and evidence sources
- Mappings between skills and employees, jobs, courses, projects, and certifications
- Controlled inference of skills from resume, experience, learning, and assessment signals
- Versioning and governance of skill taxonomy changes

Validation rules:

- Duplicate skill aliases shall be normalized or governed through merge flow
- Inferred skills shall be distinguishable from explicitly validated skills
- Deprecated skills shall preserve historical lineage and mapped replacements

# 4. UX

The user experience shall provide:

- Skills taxonomy browser
- Employee skill profile with evidence drill-down
- Admin merge and normalization workbench
- Role-to-skill gap visualization

# 5. API

Representative APIs:

- `GET /api/v1/ai/skills-graph/skills`
- `GET /api/v1/ai/skills-graph/employees/{employeeId}`
- `POST /api/v1/ai/skills-graph/normalize`
- `POST /api/v1/ai/skills-graph/infer`

# 6. Database

Core entities:

- `skill_node`
- `skill_alias`
- `employee_skill_edge`
- `role_skill_edge`
- `skill_evidence_record`

# 7. Events

The platform shall publish:

- `skills-graph.skill-created`
- `skills-graph.alias-merged`
- `skills-graph.employee-skill-updated`
- `skills-graph.inference-completed`

# 8. Reports

Required reports:

- Skill coverage report
- Skill-gap report
- Inferred-versus-validated skill report
- Taxonomy quality report

# 9. Dashboards

Dashboards shall show:

- Most common skills
- Emerging skill gaps
- Skills confidence distribution
- Taxonomy merge backlog

# 10. Security

Security controls shall include:

- Restricted access to sensitive talent inferences
- Controlled admin rights for taxonomy changes
- Role-based visibility into employee skill evidence

# 11. Audit

The audit trail shall capture:

- Taxonomy changes
- Merge decisions
- Skill inference runs
- Manual skill validation updates

# 12. AI

AI capabilities may include:

- Skill extraction and normalization
- Relationship inference between adjacent skills
- Skill-gap prioritization
- Employee-to-project matching and project-staffing recommendation based on verified skills, recency, proficiency, and availability signals

# 13. Test Cases

- Alias merge preserves existing mappings
- Inferred skill marked differently from validated skill
- Deprecated skill maps to replacement without data loss
- Skill evidence updates confidence correctly
- Role skill-gap view reflects latest employee data

# 14. Workflows

1. Taxonomy is maintained.
2. Skills are captured or inferred.
3. Graph relationships are updated.
4. Downstream talent use cases consume graph outputs.

# 15. State Machine

- `draft`
- `active`
- `merged`
- `deprecated`
- `retired`

# 16. Permissions

- Manage skills taxonomy
- Validate employee skills
- View skill evidence
- Run inference
- Merge skills

# 17. Notifications

- Merge approval alerts
- Inference completion notices
- Taxonomy conflict warnings

# 18. Configuration

- Proficiency scales
- Evidence weighting
- Taxonomy governance
- Inference rules

# 19. Edge Cases

- Same skill means different things in different functions
- Role mapping spans country-specific naming variants
- Resume inference conflicts with certification evidence
- Skill removed from taxonomy after widespread use
