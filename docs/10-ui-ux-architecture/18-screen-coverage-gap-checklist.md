---
id: HRMS-UX-018
title: Screen Coverage Gap Checklist
document: 18-screen-coverage-gap-checklist.md
version: 1.0
status: Draft
---

# 1. Purpose

This checklist is used before development or mockup signoff to confirm that screen coverage is not incomplete.

# 2. Gap Checklist

- every module in the module specification list appears in the screen coverage matrix
- every sub-module in the sub-module catalog appears in the screen coverage matrix
- every `L3` sub-module maps to at least one primary screen and one supporting screen where relevant
- every workflow-heavy sub-module has an approval, review, or exception surface if required
- every import or migration-heavy sub-module has preview, error, and commit screens
- every profile-heavy sub-module has detail, edit, restricted, and inactive states
- every analytics-heavy sub-module has drill-down and no-data treatment
- every screen has a mobile decision, even if that decision is desktop-primary
- every role-critical screen is linked to the persona boundary model
- every planned screen ref is registered before implementation starts

# 3. Current Position

The repository now has:

- a master mockup registry
- a condition and state catalog
- a module-to-sub-module-to-screen traceability matrix
- a screen surface decomposition standard

This means missing screens can now be found by audit instead of guesswork.
