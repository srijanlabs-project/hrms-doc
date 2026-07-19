import { apiRequest } from "./http";
import type { NotificationItem } from "./types";

export function listNotifications(): Promise<{ items: NotificationItem[]; unreadCount: number }> {
  return apiRequest("/notifications");
}

export function markNotificationRead(id: string): Promise<{ read: true }> {
  return apiRequest(`/notifications/${id}/read`, { method: "POST" });
}

export function markAllNotificationsRead(): Promise<{ read: true }> {
  return apiRequest("/notifications/read-all", { method: "POST" });
}
