import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { commentOnPost, createPost, listFeed, toggleLikePost } from "../../lib/api/experience";
import type { FeedPost } from "../../lib/api/types";

function FeedPostRow({ post }: { post: FeedPost }) {
  const queryClient = useQueryClient();
  const [commentBody, setCommentBody] = useState("");
  const invalidate = () => void queryClient.invalidateQueries({ queryKey: ["feed"] });
  const like = useMutation({ mutationFn: () => toggleLikePost(post.id), onSuccess: invalidate });
  const comment = useMutation({
    mutationFn: () => commentOnPost(post.id, commentBody),
    onSuccess: () => {
      invalidate();
      setCommentBody("");
    },
  });

  return (
    <li className="rounded-lg border border-border p-3">
      <p className="font-medium">{post.employee.legalName}</p>
      <p className="mt-1 text-sm text-ink-muted">{post.body}</p>
      <div className="mt-2 flex items-center gap-3 text-xs text-ink-faint">
        <button type="button" disabled={like.isPending} onClick={() => like.mutate()} className="hover:text-primary">
          👍 {post._count.likes}
        </button>
        <span>{new Date(post.createdAt).toLocaleDateString("en-IN")}</span>
      </div>
      <ul className="mt-2 space-y-1">
        {post.comments.map((c) => (
          <li key={c.id} className="text-sm">
            <span className="font-medium">{c.employee.legalName}</span> <span className="text-ink-muted">{c.body}</span>
          </li>
        ))}
      </ul>
      <form
        className="mt-2 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          comment.mutate();
        }}
      >
        <input
          required
          value={commentBody}
          onChange={(e) => setCommentBody(e.target.value)}
          placeholder="Comment…"
          className="input flex-1 text-sm"
        />
        <button
          type="submit"
          disabled={comment.isPending}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-primary disabled:opacity-60"
        >
          Reply
        </button>
      </form>
    </li>
  );
}

/** Self-service: text-only company feed. No photo uploads — see schema.prisma's FeedPost comment. */
export function FeedPanel() {
  const queryClient = useQueryClient();
  const feed = useQuery({ queryKey: ["feed"], queryFn: () => listFeed() });
  const [body, setBody] = useState("");

  const post = useMutation({
    mutationFn: () => createPost({ body }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["feed"] });
      setBody("");
    },
  });

  return (
    <Card title="Company Feed">
      <form
        className="mb-4 flex gap-2 border-b border-border pb-4"
        onSubmit={(e) => {
          e.preventDefault();
          post.mutate();
        }}
      >
        <input
          required
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share something with the team…"
          className="input flex-1"
        />
        <button
          type="submit"
          disabled={post.isPending}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          Post
        </button>
      </form>

      <ul className="space-y-3">
        {feed.data?.map((p) => (
          <FeedPostRow key={p.id} post={p} />
        ))}
        {feed.data?.length === 0 && <p className="text-ink-muted">No posts yet — be the first to share.</p>}
      </ul>
    </Card>
  );
}
