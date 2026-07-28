import { apiRequest } from "./http";
import type { Announcement, AnnouncementComment, CreateAnnouncementInput } from "./types";

export function createAnnouncement(input: CreateAnnouncementInput): Promise<Announcement> {
  return apiRequest<Announcement>("/communications/announcements", { method: "POST", body: JSON.stringify(input) });
}

export function listPublishedAnnouncements(): Promise<Announcement[]> {
  return apiRequest<Announcement[]>("/communications/announcements");
}

export function listAllAnnouncementsAdmin(): Promise<Announcement[]> {
  return apiRequest<Announcement[]>("/communications/announcements/admin");
}

export function publishAnnouncement(id: string): Promise<Announcement> {
  return apiRequest<Announcement>(`/communications/announcements/${id}/publish`, { method: "POST" });
}

export function archiveAnnouncement(id: string): Promise<Announcement> {
  return apiRequest<Announcement>(`/communications/announcements/${id}/archive`, { method: "POST" });
}

/** Wave 4 W4·E15 gap closure ("employee communications") — comments on Announcement. */
export function listAnnouncementComments(announcementId: string): Promise<AnnouncementComment[]> {
  return apiRequest<AnnouncementComment[]>(`/communications/announcements/${announcementId}/comments`);
}

export function commentOnAnnouncement(announcementId: string, body: string): Promise<AnnouncementComment> {
  return apiRequest<AnnouncementComment>(`/communications/announcements/${announcementId}/comments`, {
    method: "POST",
    body: JSON.stringify({ body }),
  });
}
