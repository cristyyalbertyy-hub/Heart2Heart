"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LoungeRoom } from "@/components/lounge-room";
import { MAX_MEMBERS } from "@/lib/rooms";

type Member = {
  id: string;
  displayName: string;
  avatarId: string;
};

type Message = {
  id: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    displayName: string;
    avatarId: string;
  };
};

export default function ChatPage() {
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [roomCode, setRoomCode] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");
  const [copied, setCopied] = useState(false);

  const others = members.filter((item) => item.id !== member?.id);
  const canInvite = members.length < MAX_MEMBERS;

  const bubbles = useMemo(() => {
    const latest = new Map<
      string,
      { memberId: string; content: string; createdAt: string }
    >();

    for (const message of messages) {
      latest.set(message.sender.id, {
        memberId: message.sender.id,
        content: message.content,
        createdAt: message.createdAt,
      });
    }

    const now = Date.now();
    return Array.from(latest.values()).filter((bubble) => {
      const age = now - new Date(bubble.createdAt).getTime();
      return age < 1000 * 60 * 8;
    });
  }, [messages]);

  const fetchMessages = useCallback(async () => {
    const response = await fetch("/api/messages");
    if (!response.ok) return;

    const data = await response.json();
    setMessages(data.messages);
    if (data.members) {
      setMembers(data.members);
    }
  }, []);

  useEffect(() => {
    async function bootstrap() {
      const meResponse = await fetch("/api/auth/me");
      if (!meResponse.ok) {
        router.replace("/");
        return;
      }

      const meData = await meResponse.json();
      setMember(meData.member);
      setMembers(meData.room.members);
      setRoomCode(meData.room.code);
      await fetchMessages();
      setLoading(false);
    }

    bootstrap();
  }, [router, fetchMessages]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchMessages();
    }, 2500);

    return () => clearInterval(interval);
  }, [fetchMessages]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/");
    router.refresh();
  }

  async function copyInvite() {
    const shareUrl = `${window.location.origin}/r/${roomCode}`;
    const text = `Join this same-room lounge with code ${roomCode}: ${shareUrl}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setNotice("Could not copy. Share this code instead: " + roomCode);
    }
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
        router.replace("/");
        router.refresh();
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
      <main className="flex min-h-full flex-1 items-center justify-center bg-gradient-to-b from-amber-50 to-rose-50">
        <p className="text-amber-900/70">Entering the lounge...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-full w-full max-w-2xl flex-1 flex-col bg-gradient-to-b from-[#2c241c] via-[#4a3b2f] to-[#1a1410]">
      <header className="sticky top-0 z-20 border-b border-amber-200/15 bg-[#1a1410]/80 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-amber-50">same-room</h1>
            <p className="text-sm text-amber-100/70">
              {others.length === 0
                ? `Welcome, ${member?.displayName}`
                : `${members.length} in the lounge`}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-full border border-amber-200/25 px-4 py-2 text-sm text-amber-50 transition hover:bg-white/10"
          >
            Leave
          </button>
        </div>
      </header>

      <div className="space-y-4 px-3 py-4 sm:px-4">
        {canInvite && (
          <div className="rounded-3xl border border-amber-200/30 bg-black/25 px-5 py-4 text-center text-amber-50 backdrop-blur">
            <p className="text-sm text-amber-100/80">
              {others.length === 0
                ? "Waiting for guests. Share this code:"
                : "Invite more guests with this code:"}
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-[0.35em] text-amber-50">
              {roomCode}
            </p>
            <button
              type="button"
              onClick={copyInvite}
              className="mt-3 rounded-full bg-amber-500 px-4 py-2 text-sm font-medium text-stone-900 transition hover:bg-amber-400"
            >
              {copied ? "Copied" : "Copy invite"}
            </button>
          </div>
        )}

        <LoungeRoom
          members={members}
          bubbles={bubbles}
          currentMemberId={member?.id}
        />
      </div>

      {notice && (
        <div className="mx-4 mb-2 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {notice}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 mt-auto border-t border-amber-200/20 bg-[#1a0f0a]/92 px-4 py-4 backdrop-blur"
      >
        <div className="flex items-end gap-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={1}
            placeholder="Say something..."
            className="max-h-32 min-h-[48px] flex-1 resize-none rounded-2xl border border-amber-200/30 bg-white/95 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-300/40"
          />
          <button
            type="submit"
            disabled={sending || !content.trim()}
            className="rounded-2xl bg-amber-500 px-5 py-3 text-sm font-medium text-stone-900 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Send
          </button>
        </div>
      </form>
    </main>
  );
}
