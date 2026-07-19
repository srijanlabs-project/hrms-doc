import { Bot } from "lucide-react";
import { useState } from "react";

/**
 * Ridz — the Staffsy AI assistant avatar.
 * Loads the brand illustration from /ridz.png (drop the asset into
 * apps/web/public/). Falls back to the bot glyph until the file exists.
 */
export function RidzAvatar({ size = 40 }: { size?: number }) {
  const [missing, setMissing] = useState(false);

  if (missing) {
    return (
      <span
        aria-hidden
        className="flex items-center justify-center rounded-full bg-primary-soft text-primary"
        style={{ width: size, height: size }}
      >
        <Bot style={{ width: size * 0.55, height: size * 0.55 }} />
      </span>
    );
  }

  return (
    <img
      src="/ridz.png"
      alt="Ridz, your Staffsy AI assistant"
      width={size}
      height={size}
      className="rounded-full bg-primary-soft object-cover object-top"
      onError={() => setMissing(true)}
    />
  );
}
