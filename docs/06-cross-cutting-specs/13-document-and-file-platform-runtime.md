---
id: HRMS-XCUT-13
title: Document and File Platform Runtime
document: 13-document-and-file-platform-runtime.md
version: 1.0
status: Draft
---

# 1. Purpose

This document defines the runtime architecture and control model for document metadata, file storage, signed retrieval, malware scanning, rendering, retention, and evidence access across the HRMS platform.

# 2. Scope

This standard applies to:

- uploaded files
- generated documents
- signed documents and evidence packages
- profile attachments and compliance proofs
- import files
- document previews and downloads

# 3. Architectural Split

- `File Service` owns binary upload intake, scan lifecycle, signed retrieval, and storage metadata
- `Document Generation Service` owns template render lifecycle and output production
- `Document domain modules` own business classification, lifecycle meaning, and access context

# 4. Upload and Scan Flow

Recommended flow:

1. client requests upload session
2. file metadata pre-check runs
3. binary lands in quarantine storage
4. malware or content scan runs
5. file is promoted to active storage if clean
6. business record links to approved file metadata

Rules:

- blocked or unscanned files must not be downloadable as trusted business artifacts
- MIME allowlist, size cap, extension policy, and filename sanitization must be enforced server-side

# 5. Storage Model

Storage classes should include:

- quarantine
- active operational
- archived
- legal hold protected

Metadata must preserve:

- checksum
- MIME type
- original filename
- storage class
- region or residency marker
- retention class
- scan status
- encryption context reference

# 6. Signed URL Rules

- signed URLs should be time-bound
- separate upload and download scopes
- URLs must be audience-specific and not reusable across tenants
- highly restricted documents may require mediated proxy download instead of direct storage URL exposure

# 7. Document Rendering and PDF Pipeline

- rendering should use stable versioned templates
- render jobs must store merge snapshot reference
- PDF output should preserve font, locale, page-break, and seal requirements
- failed render jobs should preserve diagnostic evidence without exposing raw restricted data

# 8. Retention and Evidence Retrieval

- retention class should attach at file or document metadata level
- legal hold suspends purge and archive transitions where applicable
- evidence retrieval must honor masking, permission, and support-session rules
- signed-document evidence packs should remain immutable once sealed

# 9. Access Control

- file metadata visibility may differ from binary access visibility
- reveal, preview, download, share, and export are separate permissions
- support access to restricted documents must remain masked-by-default unless reveal policy permits

# 10. Operator and Runtime APIs

Representative APIs:

- `POST /api/v1/files/upload-sessions`
- `GET /api/v1/files/{fileId}/download-link`
- `POST /api/v1/files/{fileId}/scan-callback`
- `POST /api/v1/documents/generate`
- `GET /api/v1/documents/{documentId}/evidence`

# 11. Observability and Failure Rules

- scan backlog must be visible
- render queue failures must be visible
- signed URL abuse or abnormal download volume must alert
- object storage outage should fail safely and audibly

# 12. Test Expectations

- oversize upload blocked
- malware-positive file quarantined
- expired signed URL rejected
- sealed signed document cannot be mutated
- evidence retrieval respects tenant and role scope

