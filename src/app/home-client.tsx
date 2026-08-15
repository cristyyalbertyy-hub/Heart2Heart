"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LegoAvatar } from "@/components/lego-avatar";
import { AVATARS, DEFAULT_AVATAR_ID, type AvatarId } from "@/lib/avatars";

type Mode = "create" | "join";

type HomeClientProps = {
  initialCode?: string;
};

export function HomeClient({ initialCode = "" }: HomeClientProps) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(initialCode ? "join" : "create");
  const [displayName, setDisplayName] = useState("");
  const [pin, setPin] = useState("");
  const [code, setCode] = useState(initialCode.toUpperCase());
  const [avatarId, setAvatarId] = useState<AvatarId>(DEFAULT_AVATAR_ID);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        mode === "create" ? "/api/rooms" : "/api/rooms/join",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            displayName,
            pin,
            avatarId,
            ...(mode === "join" ? { code } : {}),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Could not continue.");
        return;
      }

      router.push("/chat");
      router.refresh();
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-full flex-1 items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
            <span className="flex -space-x-2">
              <span className="h-6 w-6 rounded-full bg-rose-300" />
              <span className="h-6 w-6 rounded-full bg-rose-500" />
            </span>
          </div>
          <h1 className="text-3xl font-semibold text-rose-950">same-room</h1>
          <p className="mt-2 text-sm text-rose-700/80">
            Choose your look. Join the lounge.
          </p>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2 rounded-2xl bg-rose-100/70 p-1">
          <button
            type="button"
            onClick={() => {
              setMode("create");
              setError("");
            }}
            className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
              mode === "create"
                ? "bg-white text-rose-950 shadow-sm"
                : "text-rose-800 hover:text-rose-950"
            }`}
          >
            Start a chat
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("join");
              setError("");
            }}
            className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
              mode === "join"
                ? "bg-white text-rose-950 shadow-sm"
                : "text-rose-800 hover:text-rose-950"
            }`}
          >
            Join
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-rose-100 bg-white/80 p-6 shadow-xl shadow-rose-100/60 backdrop-blur"
        >
          {mode === "join" && (
            <label className="mb-4 block">
              <span className="mb-2 block text-sm font-medium text-rose-900">
                Chat code
              </span>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                autoComplete="off"
                spellCheck={false}
                placeholder="ABC123"
                maxLength={8}
                className="w-full rounded-2xl border border-rose-100 bg-rose-50/50 px-4 py-3 tracking-[0.2em] text-rose-950 uppercase outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-200"
                required
              />
            </label>
          )}

          <label className="mb-4 block">
            <span className="mb-2 block text-sm font-medium text-rose-900">
              Your name
            </span>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              autoComplete="nickname"
              maxLength={24}
              className="w-full rounded-2xl border border-rose-100 bg-rose-50/50 px-4 py-3 text-rose-950 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-200"
              required
            />
          </label>

          <div className="mb-4">
            <span className="mb-2 block text-sm font-medium text-rose-900">
              Your avatar
            </span>
            <div className="grid grid-cols-4 gap-2">
              {AVATARS.map((avatar) => {
                const selected = avatarId === avatar.id;
                return (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => setAvatarId(avatar.id)}
                    className={`flex flex-col items-center rounded-2xl border px-1 py-2 transition ${
                      selected
                        ? "border-rose-400 bg-rose-50 ring-2 ring-rose-200"
                        : "border-rose-100 bg-white hover:border-rose-200"
                    }`}
                  >
                    <LegoAvatar avatarId={avatar.id} size={52} seated={false} />
                    <span className="mt-1 text-[10px] font-medium text-rose-800">
                      {avatar.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <label className="mb-6 block">
            <span className="mb-2 block text-sm font-medium text-rose-900">
              4-digit PIN
            </span>
            <input
              type="password"
              inputMode="numeric"
              pattern="\d{4}"
              value={pin}
              onChange={(e) =>
                setPin(e.target.value.replace(/\D/g, "").slice(0, 4))
              }
              autoComplete="off"
              placeholder="••••"
              className="w-full rounded-2xl border border-rose-100 bg-rose-50/50 px-4 py-3 text-rose-950 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-200"
              required
            />
            <span className="mt-2 block text-xs text-rose-700/70">
              Use this to come back to the chat on another phone or browser.
            </span>
          </label>

          {error && (
            <p className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-rose-500 px-4 py-3 font-medium text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : mode === "create"
                ? "Enter the lounge"
                : "Join lounge"}
          </button>
        </form>
      </div>
    </main>
  );
}
