import { apiRequest } from "./http";
import type { Announcement, CreateAnnouncementInput } from "./types";

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
