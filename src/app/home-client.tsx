"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

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
            ...(mode === "join" ? { code } : {}),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Não foi possível continuar.");
        return;
      }

      router.push("/chat");
      router.refresh();
    } catch {
      setError("Erro de ligação. Tenta outra vez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-full flex-1 items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-3xl font-semibold text-rose-500">
            2
          </div>
          <h1 className="text-3xl font-semibold text-rose-950">talk-to-2</h1>
          <p className="mt-2 text-sm text-rose-700/80">
            Uma conversa privada, só a dois.
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
            Criar conversa
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
            Entrar
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-rose-100 bg-white/80 p-6 shadow-xl shadow-rose-100/60 backdrop-blur"
        >
          {mode === "join" && (
            <label className="mb-4 block">
              <span className="mb-2 block text-sm font-medium text-rose-900">
                Código da conversa
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
              O teu nome
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

          <label className="mb-6 block">
            <span className="mb-2 block text-sm font-medium text-rose-900">
              PIN de 4 dígitos
            </span>
            <input
              type="password"
              inputMode="numeric"
              pattern="\d{4}"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
              autoComplete="off"
              placeholder="••••"
              className="w-full rounded-2xl border border-rose-100 bg-rose-50/50 px-4 py-3 text-rose-950 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-200"
              required
            />
            <span className="mt-2 block text-xs text-rose-700/70">
              Serve para voltares a esta conversa noutro telemóvel ou browser.
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
              ? "A entrar..."
              : mode === "create"
                ? "Começar"
                : "Entrar na conversa"}
          </button>
        </form>
      </div>
    </main>
  );
}
