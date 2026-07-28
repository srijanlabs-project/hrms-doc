import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { commentOnAnnouncement, listAnnouncementComments } from "../../lib/api/communication";

/** Wave 4 W4·E15 gap closure ("employee communications") — real two-way engagement on the one-way Announcement broadcast. */
export function AnnouncementCommentThread({ announcementId }: { announcementId: string }) {
  const queryClient = useQueryClient();
  const comments = useQuery({
    queryKey: ["announcement-comments", announcementId],
    queryFn: () => listAnnouncementComments(announcementId),
  });
  const [body, setBody] = useState("");

  const submit = useMutation({
    mutationFn: () => commentOnAnnouncement(announcementId, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["announcement-comments", announcementId] });
      setBody("");
    },
  });

  return (
    <div className="mt-3 border-t border-border pt-3">
      <ul className="mb-2 space-y-1.5">
        {comments.data?.map((c) => (
          <li key={c.id} className="text-sm">
            <span className="font-medium">{c.employee.legalName}</span>{" "}
            <span className="text-ink-muted">{c.body}</span>
          </li>
        ))}
      </ul>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          submit.mutate();
        }}
      >
        <input
          required
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add a comment…"
          className="input flex-1 text-sm"
        />
        <button
          type="submit"
          disabled={submit.isPending}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-primary disabled:opacity-60"
        >
          Post
        </button>
      </form>
    </div>
  );
}
