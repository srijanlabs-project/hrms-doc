import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import {
  archiveAnnouncement,
  createAnnouncement,
  listAllAnnouncementsAdmin,
  listPublishedAnnouncements,
  publishAnnouncement,
} from "../../lib/api/communication";
import { ApiError } from "../../lib/api/http";
import { useAuth } from "../auth/AuthProvider";
import { AnnouncementCommentThread } from "./AnnouncementCommentThread";
import { announcementStatusTone, categoryTone } from "./status-tone";

const ADMIN_ROLES = ["org_admin", "hr_ops"];
const CATEGORIES = ["General", "Policy", "Event", "Holiday", "Urgent"] as const;

function CreateAnnouncementForm() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("General");

  const create = useMutation({
    mutationFn: () => createAnnouncement({ title, body, category }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["announcements-admin"] });
      setTitle("");
      setBody("");
    },
  });
  const errorMessage = create.error instanceof ApiError ? create.error.message : undefined;

  return (
    <form
      className="mb-4 space-y-2 border-b border-border pb-4"
      onSubmit={(e) => {
        e.preventDefault();
        create.mutate();
      }}
    >
      {errorMessage && <p className="rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      <div className="flex flex-wrap items-center gap-2">
        <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="input flex-1" />
        <select value={category} onChange={(e) => setCategory(e.target.value as typeof category)} className="input">
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <textarea required value={body} onChange={(e) => setBody(e.target.value)} placeholder="Message…" className="input w-full" rows={3} />
      <button
        type="submit"
        disabled={create.isPending}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
      >
        {create.isPending ? "Saving…" : "Create Draft"}
      </button>
    </form>
  );
}

function AnnouncementRow({ id, title, body, category, status }: { id: string; title: string; body: string; category: string; status: string }) {
  const queryClient = useQueryClient();
  const invalidate = () => void queryClient.invalidateQueries({ queryKey: ["announcements-admin"] });
  const publish = useMutation({ mutationFn: () => publishAnnouncement(id), onSuccess: invalidate });
  const archive = useMutation({ mutationFn: () => archiveAnnouncement(id), onSuccess: invalidate });

  return (
    <li className="rounded-lg border border-border p-3">
      <div className="flex items-center justify-between">
        <span className="font-medium">{title}</span>
        <span className="flex items-center gap-1.5">
          <Badge tone={categoryTone(category)}>{category}</Badge>
          <Badge tone={announcementStatusTone(status)}>{status}</Badge>
        </span>
      </div>
      <p className="mt-1 text-sm text-ink-muted">{body}</p>
      <div className="mt-2 flex gap-2">
        {status === "Draft" && (
          <button
            type="button"
            disabled={publish.isPending}
            onClick={() => publish.mutate()}
            className="rounded-lg border border-border px-3 py-1 text-xs font-medium hover:border-primary disabled:opacity-60"
          >
            Publish
          </button>
        )}
        {status === "Published" && (
          <button
            type="button"
            disabled={archive.isPending}
            onClick={() => archive.mutate()}
            className="rounded-lg border border-border px-3 py-1 text-xs font-medium hover:border-negative hover:text-negative disabled:opacity-60"
          >
            Archive
          </button>
        )}
      </div>
    </li>
  );
}

/** Self-service: browse published announcements and join the conversation via comments. */
function PublishedAnnouncementsPanel() {
  const published = useQuery({ queryKey: ["announcements-published"], queryFn: listPublishedAnnouncements });

  return (
    <Card title="Company Announcements">
      <ul className="space-y-3">
        {published.data?.map((a) => (
          <li key={a.id} className="rounded-lg border border-border p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">{a.title}</span>
              <Badge tone={categoryTone(a.category)}>{a.category}</Badge>
            </div>
            <p className="mt-1 text-sm text-ink-muted">{a.body}</p>
            <AnnouncementCommentThread announcementId={a.id} />
          </li>
        ))}
        {published.data?.length === 0 && <p className="text-ink-muted">No announcements published yet.</p>}
      </ul>
    </Card>
  );
}

/**
 * Announcements — docs/03-module-specifications/23-communication-platform.md.
 * Self-service: published announcements, also surfaced on the home
 * dashboard, now with a real comment thread per announcement (Wave 3 E15 gap
 * closure — "employee communications"). Admin (gated below): create/publish/
 * archive the full catalog.
 */
export function AnnouncementsPage() {
  const { user } = useAuth();
  const isAdmin = ADMIN_ROLES.some((role) => user?.roles.includes(role));
  const announcements = useQuery({ queryKey: ["announcements-admin"], queryFn: listAllAnnouncementsAdmin, enabled: isAdmin });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Announcements</h1>
        <p className="text-ink-muted">Company-wide announcements, news, and bulletin-board posts.</p>
      </header>

      <PublishedAnnouncementsPanel />

      {isAdmin && (
        <Card title="Manage Announcements">
          <CreateAnnouncementForm />
          <ul className="space-y-2">
            {announcements.data?.map((a) => (
              <AnnouncementRow key={a.id} id={a.id} title={a.title} body={a.body} category={a.category} status={a.status} />
            ))}
            {announcements.data?.length === 0 && <p className="text-ink-muted">No announcements yet.</p>}
          </ul>
        </Card>
      )}
    </div>
  );
}
