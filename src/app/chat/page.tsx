"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DialoguePanel } from "@/components/dialogue-panel";
import { LoungeRoom } from "@/components/lounge-room";
import { MAX_MEMBERS } from "@/lib/rooms";
import {
  blobToDataUrl,
  encodeVoiceMessage,
  MAX_VOICE_SECONDS,
} from "@/lib/voice";

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

type MobileView = "room" | "text";

export default function ChatPage() {
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [roomCode, setRoomCode] = useState("");
  const [sceneId, setSceneId] = useState("sala-01");
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");
  const [copied, setCopied] = useState(false);
  const [mobileView, setMobileView] = useState<MobileView>("room");
  const [recording, setRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

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
      setSceneId(meData.room.sceneId ?? "sala-01");
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
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      mediaRecorderRef.current?.stream.getTracks().forEach((track) => track.stop());
    };
  }, []);

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

  async function sendMessage(trimmed: string) {
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

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || sending || recording) return;
    await sendMessage(trimmed);
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
  }

  async function toggleRecording() {
    if (sending) return;

    if (recording) {
      stopRecording();
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setNotice("This browser cannot record voice notes.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : MediaRecorder.isTypeSupported("audio/mp4")
            ? "audio/mp4"
            : "";
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        if (timerRef.current) window.clearInterval(timerRef.current);
        setRecording(false);
        setRecordSeconds(0);
        mediaRecorderRef.current = null;

        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/mp4",
        });
        chunksRef.current = [];

        if (blob.size < 800) {
          setNotice("Voice note was too short.");
          return;
        }

        try {
          const dataUrl = await blobToDataUrl(blob);
          await sendMessage(encodeVoiceMessage(dataUrl));
        } catch {
          setNotice("Could not send the voice note.");
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
      setRecordSeconds(0);
      setNotice("");
      timerRef.current = window.setInterval(() => {
        setRecordSeconds((current) => {
          const next = current + 1;
          if (next >= MAX_VOICE_SECONDS) {
            stopRecording();
          }
          return next;
        });
      }, 1000);
    } catch {
      setNotice("Microphone permission is needed to send a voice note.");
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
    <main className="mx-auto flex min-h-full w-full max-w-6xl flex-1 flex-col bg-gradient-to-b from-[#2c241c] via-[#4a3b2f] to-[#1a1410]">
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

        {/* Mobile: choose room or text-only dialogue */}
        <div className="mt-3 grid grid-cols-2 gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setMobileView("room")}
            className={`rounded-full px-3 py-2 text-sm font-medium transition ${
              mobileView === "room"
                ? "bg-amber-500 text-stone-900"
                : "border border-amber-200/25 text-amber-50"
            }`}
          >
            Quarto
          </button>
          <button
            type="button"
            onClick={() => setMobileView("text")}
            className={`rounded-full px-3 py-2 text-sm font-medium transition ${
              mobileView === "text"
                ? "bg-amber-500 text-stone-900"
                : "border border-amber-200/25 text-amber-50"
            }`}
          >
            Texto
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-4 px-3 py-4 sm:px-4">
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

        <div className="grid min-h-0 flex-1 gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(220px,0.8fr)]">
          <div
            className={
              mobileView === "room" ? "block" : "hidden md:block"
            }
          >
            <LoungeRoom
              members={members}
              bubbles={bubbles}
              sceneId={sceneId}
            />
          </div>

          <DialoguePanel
            messages={messages}
            className={`min-h-[280px] md:min-h-[420px] ${
              mobileView === "text" ? "flex" : "hidden md:flex"
            }`}
          />
        </div>
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
        <div className="flex items-end gap-2 sm:gap-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={1}
            placeholder={recording ? "Recording..." : "Say something..."}
            disabled={recording}
            className="max-h-32 min-h-[48px] flex-1 resize-none rounded-2xl border border-amber-200/30 bg-white/95 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-300/40 disabled:opacity-70"
          />
          <button
            type="button"
            onClick={toggleRecording}
            disabled={sending}
            className={`rounded-2xl px-4 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
              recording
                ? "bg-rose-500 text-white"
                : "border border-amber-200/30 text-amber-50 hover:bg-white/10"
            }`}
          >
            {recording ? `${recordSeconds}s` : "Voz"}
          </button>
          <button
            type="submit"
            disabled={sending || recording || !content.trim()}
            className="rounded-2xl bg-amber-500 px-5 py-3 text-sm font-medium text-stone-900 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Send
          </button>
        </div>
      </form>
    </main>
  );
}
