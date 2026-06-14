"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Could not sign in.");
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
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-3xl">
            ♥
          </div>
          <h1 className="text-3xl font-semibold text-rose-950">Heart2Heart</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-rose-100 bg-white/80 p-6 shadow-xl shadow-rose-100/60 backdrop-blur"
        >
          <label className="mb-4 block">
            <span className="mb-2 block text-sm font-medium text-rose-900">
              Username
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              className="w-full rounded-2xl border border-rose-100 bg-rose-50/50 px-4 py-3 text-rose-950 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-200"
              required
            />
          </label>

          <label className="mb-6 block">
            <span className="mb-2 block text-sm font-medium text-rose-900">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full rounded-2xl border border-rose-100 bg-rose-50/50 px-4 py-3 text-rose-950 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-200"
              placeholder="••••••••"
              required
            />
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
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
