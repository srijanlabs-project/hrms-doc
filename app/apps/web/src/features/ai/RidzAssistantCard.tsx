import { useMutation } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { RidzAvatar } from "../../components/ui/RidzAvatar";
import { askRidz } from "../../lib/api/ai";

const DEFAULT_SUGGESTIONS = [
  "What's my leave balance?",
  "Did I mark attendance today?",
  "What's my latest payslip?",
  "How many employees do we have?",
];

interface ChatMessage {
  role: "user" | "ridz";
  text: string;
}

/**
 * Ridz assistant panel, wired to the real AI-gateway (POST /ai/ask). The
 * backend's StaticDevAiProvider does keyword matching over real tenant
 * data, not a language model — see that file's comment for the Claude API
 * swap-in plan. No conversation history is sent to the backend; each
 * question is answered independently.
 */
export function RidzAssistantCard({ firstName }: { firstName: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState(DEFAULT_SUGGESTIONS);

  const askMutation = useMutation({
    mutationFn: (message: string) => askRidz(message),
    onSuccess: (answer, message) => {
      setMessages((prev) => [...prev, { role: "user", text: message }, { role: "ridz", text: answer.reply }]);
      setSuggestions(answer.suggestions);
    },
  });

  function send(message: string) {
    if (!message.trim() || askMutation.isPending) return;
    askMutation.mutate(message);
    setInput("");
  }

  return (
    <Card>
      <div className="mb-3 flex items-center gap-2">
        <RidzAvatar size={32} />
        <span className="font-semibold">Ridz</span>
        <Badge tone="primary">BETA</Badge>
      </div>

      {messages.length === 0 ? (
        <p className="mb-3 text-ink-muted">Hi {firstName}! I'm Ridz — how can I help you today?</p>
      ) : (
        <div className="mb-3 max-h-64 space-y-2 overflow-y-auto">
          {messages.map((message, i) => (
            <div
              key={i}
              className={`rounded-lg px-3 py-2 text-sm whitespace-pre-line ${
                message.role === "user" ? "ml-6 bg-primary-soft text-primary" : "mr-6 bg-canvas"
              }`}
            >
              {message.text}
            </div>
          ))}
          {askMutation.isPending && <div className="mr-6 rounded-lg bg-canvas px-3 py-2 text-sm text-ink-faint">Thinking…</div>}
        </div>
      )}

      <div className="space-y-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            disabled={askMutation.isPending}
            onClick={() => send(suggestion)}
            className="block w-full rounded-lg border border-border px-3 py-2 text-left hover:border-primary hover:bg-primary-soft disabled:opacity-60"
          >
            {suggestion}
          </button>
        ))}
      </div>

      <form
        className="mt-3 flex items-center gap-2 rounded-lg border border-border px-3 py-2"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={askMutation.isPending}
          className="w-full bg-transparent outline-none placeholder:text-ink-faint"
          placeholder="Ask Ridz anything about HR…"
        />
        <button type="submit" disabled={askMutation.isPending} className="shrink-0 disabled:opacity-60">
          <Send className="h-4 w-4 text-primary" />
        </button>
      </form>
    </Card>
  );
}
