---
id: HRMS-SUB-06-03
title: Career portal Specification
document: 03-career-portal.md
version: 2.0
status: Draft
---

# 1. Purpose and Scope

Career Portal governs the public-facing job discovery and application experience for external candidates.

In scope:

- Job listing publication
- Search and filtering
- Employer brand presentation
- Candidate application entry
- Campaign, referral, and analytics integration

# 2. Business

The career portal is the organization's recruitment storefront. It shapes candidate experience, employer brand perception, source quality, and application conversion.

Business outcomes:

- Increase qualified applicant conversion from public traffic
- Present a consistent employer brand across countries and business units
- Reduce drop-offs between job discovery and completed application
- Improve traceability of campaigns, referrals, and source effectiveness

# 3. Functional

The system shall support:

- Publication of approved requisitions to a public or semi-public portal
- Search, filters, alerts, saved jobs, and job sharing
- Employer branding pages, culture content, and benefits highlights
- SEO-aware job pages and campaign-linked landing pages
- Multi-language and multi-region portal variants
- Entry into candidate profile creation or fast application flows
- Referral links, campaign codes, and trackable source attribution
- Featured jobs, campus drives, hiring events, and seasonal campaigns

Detailed rules:

- Only approved and posting-ready requisitions shall appear externally
- Expired or closed requisitions shall be removed or marked unavailable promptly
- Regional privacy notices and consent steps shall align with candidate geography
- Search results shall respect brand, geography, and worker-type posting restrictions

# 4. UX

The user experience shall provide:

- Fast-loading job search with keyword, location, function, experience, and remote filters
- Branded landing pages for business units, locations, and campaigns
- Clear apply calls to action with minimal friction and visible progress
- Accessible and mobile-optimized layouts for global candidate reach
- Optional talent-community sign-up for candidates not ready to apply

Experience considerations:

- Candidate must be able to start from public listing and continue later
- Job pages shall show enough detail to reduce irrelevant applications
- Broken or removed jobs shall route users to similar opportunities or general search

# 5. API

Representative APIs:

- `GET /api/v1/career-portal/jobs`
- `GET /api/v1/career-portal/jobs/{jobSlug}`
- `GET /api/v1/career-portal/filters`
- `POST /api/v1/career-portal/job-alerts`
- `POST /api/v1/career-portal/campaign-attribution`

API requirements:

- Public APIs shall be rate-limited and CDN-friendly
- Job payloads shall expose only externally publishable fields
- Campaign-attribution endpoints shall preserve consent and privacy controls

# 6. Database

Core entities:

- `career_site`
- `published_job`
- `job_campaign`
- `job_alert_subscription`
- `portal_content_block`
- `source_attribution_event`

Key data requirements:

- Published job records shall store source requisition, publish dates, locale, and visibility scope
- Content blocks shall support country, brand, and language targeting
- Attribution events shall retain campaign, referrer, device, and session metadata

# 7. Events

The platform shall publish:

- `career-job.published`
- `career-job.unpublished`
- `career-job.viewed`
- `career-job.shared`
- `career-alert.subscribed`
- `career-application.started`

# 8. Reports

Required reports:

- Career portal traffic and conversion report
- Source and campaign effectiveness report
- Job-page drop-off analysis
- Search keyword and filter usage report
- Device and geography conversion report

# 9. Dashboards

Dashboards shall show:

- Top viewed and top converting jobs
- Campaign performance and cost per applicant where integrated
- Abandonment rate from view to application start
- Geography-wise portal performance

# 10. Security

Security controls shall include:

- Protection against scraping, spam, and bot submissions
- Content publishing approval before public release
- Privacy-compliant tracking and consent handling
- Web-application security controls for public traffic exposure

# 11. Audit

The audit trail shall capture:

- Job publication and unpublication events
- Content edits and campaign-page updates
- Consent text version shown to candidates
- Public posting scope changes

# 12. AI

AI capabilities may include:

- Personalized recommended jobs for returning visitors
- Content optimization suggestions for hard-to-fill roles
- Search synonym expansion for better job discoverability

AI guardrails:

- AI recommendations shall not hide eligible jobs unfairly
- Publicly visible AI-generated content shall remain recruiter-reviewed

# 13. Test Cases

Minimum test coverage shall include:

- Closed requisition disappears from public search
- Campaign tracking persists from landing page to application start
- Regional privacy notice changes by candidate geography
- Search filters return correct job subsets
- Mobile candidate can complete the job-discovery flow without layout breaks

# 14. Workflows

Primary workflow:

1. Requisition is approved and marked posting-ready.
2. Job is published to the correct portal variant.
3. Candidate discovers job through search, referral, or campaign.
4. Candidate reviews job details and starts application.
5. Source attribution is retained for reporting and downstream recruiting.

# 15. State Machine

Supported states:

- `draft`
- `scheduled`
- `published`
- `paused`
- `expired`
- `closed`
- `archived`

# 16. Permissions

Permissions shall include:

- Publish and unpublish jobs
- Edit career-site content
- Manage campaigns and landing pages
- View portal analytics
- Configure public branding assets

# 17. Notifications

Notifications shall support:

- Alert subscribers for matching new jobs
- Recruiter notifications for failed publication attempts
- Marketing and talent-acquisition alerts for campaign milestones

# 18. Configuration

Administrators shall configure:

- Portal branding, domains, and locale variants
- Search filters and taxonomy mappings
- Campaign parameter capture rules
- Job publication rules by requisition type and country

# 19. Edge Cases

The design shall address:

- Same requisition published on multiple branded sites
- Country-specific posting restrictions for sensitive roles
- Traffic spikes during campus or mass hiring campaigns
- Public link persists after requisition close
- External candidate starts apply flow when portal service is degraded
