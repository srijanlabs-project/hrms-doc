import { ApiError, type ApiErrorPayload } from "./http";
import type { StoredFile } from "./types";

/**
 * File Storage engine client. Separate from apiRequest() in http.ts because
 * uploads are multipart (no JSON Content-Type, browser sets its own
 * boundary) and downloads are a plain authenticated link, not a JSON fetch.
 */
export async function uploadFile(file: File): Promise<StoredFile> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/v1/files", {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const body = await res.json();
  if (!res.ok) {
    throw new ApiError((body as { error: ApiErrorPayload }).error);
  }
  return (body as { data: StoredFile }).data;
}

/** Same-origin link — the session cookie rides along automatically, no fetch() needed. */
export function fileDownloadUrl(fileId: string): string {
  return `/api/v1/files/${fileId}`;
}
