"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Member = {
  id: string;
  displayName: string;
};

type Message = {
  id: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    displayName: string;
  };
};

export default function ChatPage() {
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [roomCode, setRoomCode] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");
  const [copied, setCopied] = useState(false);

  const partner = members.find((item) => item.id !== member?.id);
  const waitingForPartner = members.length < 2;

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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/");
    router.refresh();
  }

  async function copyInvite() {
    const shareUrl = `${window.location.origin}/r/${roomCode}`;
    const text = `Entra na conversa talk-to-2 com o código ${roomCode}: ${shareUrl}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setNotice("Não foi possível copiar. Partilha o código à mão: " + roomCode);
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
        setNotice(data.error ?? "Não foi possível enviar a mensagem.");
        return;
      }

      setContent("");

      if (data.goodbye) {
        setMessages([]);
        setNotice("A conversa foi apagada.");
        return;
      }

      setMessages((current) => [...current, data.message]);
    } catch {
      setNotice("Erro de ligação. Tenta outra vez.");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-full flex-1 items-center justify-center">
        <p className="text-rose-700">A carregar...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-full w-full max-w-2xl flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b border-rose-100 bg-white/90 px-4 py-4 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-rose-950">talk-to-2</h1>
            <p className="text-sm text-rose-700/80">
              {partner
                ? `Com ${partner.displayName}`
                : `Olá, ${member?.displayName}`}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-full border border-rose-200 px-4 py-2 text-sm text-rose-800 transition hover:bg-rose-50"
          >
            Sair
          </button>
        </div>
      </header>

      {waitingForPartner && (
        <div className="mx-4 mt-4 rounded-3xl border border-rose-100 bg-white/80 px-5 py-4 text-center shadow-sm">
          <p className="text-sm text-rose-800">
            À espera da outra pessoa. Partilha este código:
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-[0.35em] text-rose-950">
            {roomCode}
          </p>
          <button
            type="button"
            onClick={copyInvite}
            className="mt-3 rounded-full bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-600"
          >
            {copied ? "Copiado" : "Copiar convite"}
          </button>
        </div>
      )}

      <section className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((message) => {
          const isMine = message.sender.id === member?.id;
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
                  {new Date(message.createdAt).toLocaleTimeString("pt-PT", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
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
            placeholder="Escreve uma mensagem..."
            className="max-h-32 min-h-[48px] flex-1 resize-none rounded-2xl border border-rose-100 bg-rose-50/50 px-4 py-3 text-sm text-rose-950 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-200"
          />
          <button
            type="submit"
            disabled={sending || !content.trim()}
            className="rounded-2xl bg-rose-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Enviar
          </button>
        </div>
      </form>
    </main>
  );
}
