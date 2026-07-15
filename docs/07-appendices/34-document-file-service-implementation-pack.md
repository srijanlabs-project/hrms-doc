---
id: HRMS-APP-34
title: Document and File Service Implementation Pack
document: 34-document-file-service-implementation-pack.md
version: 1.0
status: Draft
---

# 1. Purpose

This appendix closes the document and file platform depth gap by defining concrete file-service APIs, storage-class policy, physical entities, and operator surfaces.

# 2. Concrete API Families

- `POST /api/v1/files/upload-sessions`
- `GET /api/v1/files/{fileId}`
- `GET /api/v1/files/{fileId}/download-link`
- `POST /api/v1/files/{fileId}/scan-callback`
- `POST /api/v1/documents/generate`
- `GET /api/v1/documents/{documentId}/evidence`

# 3. Physical Entities

- `file_record`
- `file_scan_result`
- `file_access_grant`
- `document_record`
- `document_version`
- `document_generation_job`

# 4. Storage-Class Policy

Required classes:

- quarantine
- active secure
- archive
- legal hold

Every file record must retain:

- checksum
- MIME type
- size
- storage class
- region marker
- retention class
- scan status

# 5. Operator Screens

- upload diagnostics console
- scan backlog console
- evidence retrieval console
- retention or storage monitor

