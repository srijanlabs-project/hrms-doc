import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { listNotifications, markAllNotificationsRead, markNotificationRead } from "../../lib/api/notifications";
import type { NotificationItem } from "../../lib/api/types";

function timeAgo(iso: string): string {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: listNotifications,
    refetchInterval: 30_000,
  });

  async function openItem(item: NotificationItem) {
    if (!item.readAt) {
      await markNotificationRead(item.id);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
    setOpen(false);
    if (item.linkPath) navigate(item.linkPath);
  }

  async function handleMarkAllRead() {
    await markAllNotificationsRead();
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  }

  const unreadCount = query.data?.unreadCount ?? 0;

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-lg p-2 text-ink-muted hover:bg-canvas hover:text-ink"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-negative px-1 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close notifications"
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-2 w-80 rounded-(--radius-card) border border-border bg-surface shadow-(--shadow-raised)">
            <div className="flex items-center justify-between border-b border-border px-4 py-2">
              <span className="font-semibold">Notifications</span>
              {unreadCount > 0 && (
                <button type="button" onClick={handleMarkAllRead} className="text-xs text-primary hover:underline">
                  Mark all read
                </button>
              )}
            </div>
            <ul className="max-h-80 overflow-y-auto">
              {(query.data?.items.length ?? 0) === 0 && (
                <li className="px-4 py-6 text-center text-ink-muted">No notifications yet.</li>
              )}
              {query.data?.items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => openItem(item)}
                    className={`block w-full border-b border-border px-4 py-3 text-left last:border-0 hover:bg-canvas ${
                      item.readAt ? "" : "bg-primary-soft/40"
                    }`}
                  >
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs text-ink-muted">{item.body}</div>
                    <div className="mt-1 text-[11px] text-ink-faint">{timeAgo(item.createdAt)}</div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
