import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { createKnowledgeArticle, listAllKnowledgeArticlesAdmin, listPublishedKnowledgeArticles } from "../../lib/api/helpdesk";
import { ApiError } from "../../lib/api/http";

const QUEUES = ["HR", "IT", "Admin", "Finance"] as const;

function CreateArticleForm() {
  const queryClient = useQueryClient();
  const [queue, setQueue] = useState<(typeof QUEUES)[number]>("HR");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  const create = useMutation({
    mutationFn: () => createKnowledgeArticle({ queue, title, body, isPublished }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["knowledge-articles-admin"] });
      void queryClient.invalidateQueries({ queryKey: ["knowledge-articles"] });
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
        <select value={queue} onChange={(e) => setQueue(e.target.value as typeof queue)} className="input">
          {QUEUES.map((q) => (
            <option key={q} value={q}>
              {q}
            </option>
          ))}
        </select>
        <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="input flex-1" />
        <label className="flex items-center gap-1.5 text-sm text-ink-muted">
          <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
          Published
        </label>
      </div>
      <textarea required value={body} onChange={(e) => setBody(e.target.value)} placeholder="Article body…" className="input w-full" rows={3} />
      <button
        type="submit"
        disabled={create.isPending}
        className="rounded-lg border border-border px-3 py-2 text-xs font-medium hover:border-primary disabled:opacity-60"
      >
        Save Article
      </button>
    </form>
  );
}

/** Self-service: browse published articles. Admin (gated at the caller): create/manage the full catalog. */
export function KnowledgeBasePanel({ isAdmin }: { isAdmin: boolean }) {
  const published = useQuery({ queryKey: ["knowledge-articles"], queryFn: () => listPublishedKnowledgeArticles() });
  const all = useQuery({
    queryKey: ["knowledge-articles-admin"],
    queryFn: listAllKnowledgeArticlesAdmin,
    enabled: isAdmin,
  });
  const articles = isAdmin ? all.data : published.data;

  return (
    <Card title="Knowledge Base">
      {isAdmin && <CreateArticleForm />}
      <ul className="space-y-2">
        {articles?.map((a) => (
          <li key={a.id} className="rounded-lg border border-border p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">{a.title}</span>
              <div className="flex items-center gap-1.5">
                <Badge tone="neutral">{a.queue}</Badge>
                {isAdmin && <Badge tone={a.isPublished ? "positive" : "neutral"}>{a.isPublished ? "Published" : "Draft"}</Badge>}
              </div>
            </div>
            <p className="mt-1 text-sm text-ink-muted">{a.body}</p>
          </li>
        ))}
        {articles?.length === 0 && <p className="text-ink-muted">No articles yet.</p>}
      </ul>
    </Card>
  );
}
