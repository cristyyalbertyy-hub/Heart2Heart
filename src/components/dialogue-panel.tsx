"use client";

import { getAvatar } from "@/lib/avatars";

type DialogueMessage = {
  id: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    displayName: string;
    avatarId?: string;
  };
};

type DialoguePanelProps = {
  messages: DialogueMessage[];
  className?: string;
};

function formatTime(value: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

export function DialoguePanel({
  messages,
  className = "",
}: DialoguePanelProps) {
  return (
    <aside
      className={`flex min-h-0 flex-col overflow-hidden rounded-[1.5rem] border border-amber-200/25 bg-black/35 backdrop-blur ${className}`}
    >
      <div className="border-b border-amber-200/15 px-3 py-2.5">
        <p className="text-xs font-medium tracking-wide text-amber-100/80 uppercase">
          Diálogo
        </p>
      </div>

      <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto px-3 py-3">
        {messages.length === 0 ? (
          <p className="text-sm text-amber-100/45">
            Ainda não há mensagens nesta sala.
          </p>
        ) : (
          messages.map((message) => {
            const look = getAvatar(message.sender.avatarId);
            return (
              <div
                key={message.id}
                className="rounded-2xl px-3 py-2"
                style={{
                  backgroundColor: look.top,
                  color: look.nameColor,
                }}
              >
                <div className="mb-0.5 flex items-baseline justify-between gap-2">
                  <span className="text-[11px] font-semibold opacity-90">
                    {message.sender.displayName}
                  </span>
                  <span className="text-[10px] opacity-60">
                    {formatTime(message.createdAt)}
                  </span>
                </div>
                <p className="text-sm leading-snug break-words whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
