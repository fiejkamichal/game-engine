"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { GameState } from "@game-engine/engine";

interface Props {
  readonly gameId: string;
}

export function NewMatchButton({ gameId }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startMatch() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/matches", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ gameId }),
      });
      if (!res.ok) {
        const errBody = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(errBody.error ?? `HTTP ${res.status}`);
      }
      const state = (await res.json()) as GameState;
      router.push(`/match/${state.matchId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nieznany błąd.");
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={startMatch}
        disabled={busy}
        className="btn-accent w-fit"
      >
        {busy ? "Tworzenie…" : "Nowy mecz"}
      </button>
      {error !== null && (
        <p className="text-sm" style={{ color: "var(--danger)" }} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
