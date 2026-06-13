"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  userId: string;
  username: string;
  displayName: string;
};

type Message = {
  id: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    displayName: string;
    username: string;
  };
};

export default function ChatPage() {
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    async function bootstrap() {
      const meResponse = await fetch("/api/auth/me");
      if (!meResponse.ok) {
        router.replace("/login");
        return;
      }

      const meData = await meResponse.json();
      setUser(meData.user);
      await fetchMessages();
      setLoading(false);
    }

    bootstrap();
  }, [router]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchMessages();
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function fetchMessages() {
    const response = await fetch("/api/messages");
    if (!response.ok) return;

    const data = await response.json();
    setMessages(data.messages);
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || sending) return;

    setSending(true);
    setNotice("");

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: trimmed }),
      });

      const data = await response.json();

      if (!response.ok) {
        setNotice(data.error ?? "Could not send message.");
        return;
      }

      setContent("");

      if (data.goodbye) {
        setMessages([]);
        setNotice("Conversation ended. All messages have been deleted.");
        return;
      }

      setMessages((current) => [...current, data.message]);
    } catch {
      setNotice("Connection error. Please try again.");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-full flex-1 items-center justify-center">
        <p className="text-rose-700">Loading...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-full w-full max-w-2xl flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b border-rose-100 bg-white/90 px-4 py-4 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-rose-950">Heart2Heart</h1>
            <p className="text-sm text-rose-700/80">
              Hi, {user?.displayName}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-full border border-rose-200 px-4 py-2 text-sm text-rose-800 transition hover:bg-rose-50"
          >
            Sign out
          </button>
        </div>
      </header>

      <section className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-rose-200 bg-white/70 px-6 py-10 text-center text-sm text-rose-700/80">
            No messages yet. Send the first one.
            <br />
            <span className="mt-2 block text-xs">
              To end privately, send <strong>Goodbye</strong>.
            </span>
          </div>
        ) : (
          messages.map((message) => {
            const isMine = message.sender.id === user?.userId;
            return (
              <div
                key={message.id}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm shadow-sm ${
                    isMine
                      ? "rounded-br-md bg-rose-500 text-white"
                      : "rounded-bl-md border border-rose-100 bg-white text-rose-950"
                  }`}
                >
                  {!isMine && (
                    <p className="mb-1 text-xs font-medium text-rose-500">
                      {message.sender.displayName}
                    </p>
                  )}
                  <p className="whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                  <p
                    className={`mt-2 text-[10px] ${
                      isMine ? "text-rose-100" : "text-rose-400"
                    }`}
                  >
                    {new Date(message.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </section>

      {notice && (
        <div className="mx-4 mb-2 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {notice}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 border-t border-rose-100 bg-white/95 px-4 py-4 backdrop-blur"
      >
        <div className="flex items-end gap-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={1}
            placeholder="Write a message..."
            className="max-h-32 min-h-[48px] flex-1 resize-none rounded-2xl border border-rose-100 bg-rose-50/50 px-4 py-3 text-sm text-rose-950 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-200"
          />
          <button
            type="submit"
            disabled={sending || !content.trim()}
            className="rounded-2xl bg-rose-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Send
          </button>
        </div>
        <p className="mt-2 text-center text-[11px] text-rose-600/70">
          Send <strong>Goodbye</strong> to delete the entire conversation
        </p>
      </form>
    </main>
  );
}
