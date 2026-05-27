"use client";

import { useState } from "react";

import type {
  GameState,
  Move,
  MoveError,
  Piece,
} from "@game-engine/engine";

interface Props {
  readonly initialState: GameState;
}

interface MoveErrorBody {
  readonly error?: MoveError | string;
}

const PLAYER_LABEL: Record<string, string> = {
  white: "Biały",
  black: "Czarny",
};

function pieceLabel(piece: Piece | null | undefined): string {
  if (!piece) return "";
  return piece.kind.toUpperCase();
}

function playerLabel(player: string): string {
  return PLAYER_LABEL[player] ?? player;
}

function statusBanner(state: GameState): string {
  switch (state.outcome.status) {
    case "ongoing":
      return `Tura: ${playerLabel(state.currentPlayer)}`;
    case "win":
      return `Wygrał: ${playerLabel(state.outcome.winner)}`;
    case "draw":
      return "Remis";
  }
}

function statusToneClass(state: GameState): string {
  switch (state.outcome.status) {
    case "win":
      return "text-emerald-300";
    case "draw":
      return "text-amber-300";
    case "ongoing":
      return "text-neutral-200";
  }
}

export function MatchBoard({ initialState }: Props) {
  const [state, setState] = useState<GameState>(initialState);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendMove(move: Move) {
    if (busy) return;
    if (state.outcome.status !== "ongoing") return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/matches/${state.matchId}/moves`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ move }),
      });
      if (!res.ok) {
        const errBody = (await res.json().catch(() => ({}))) as MoveErrorBody;
        const message =
          typeof errBody.error === "string"
            ? errBody.error
            : ((errBody.error as MoveError | undefined)?.reason ??
              `HTTP ${res.status}`);
        throw new Error(message);
      }
      const next = (await res.json()) as GameState;
      setState(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nieznany błąd.");
    } finally {
      setBusy(false);
    }
  }

  function onCellClick(row: number, col: number) {
    const move = { kind: "place" as const, cell: { row, col } };
    void sendMove(move);
  }

  const finished = state.outcome.status !== "ongoing";
  const cols = state.board[0]?.length ?? 1;

  return (
    <section
      aria-label="Plansza gry"
      className="flex flex-col items-center gap-6"
    >
      <p
        className={`text-lg font-medium ${statusToneClass(state)}`}
        aria-live="polite"
      >
        {statusBanner(state)}
      </p>

      <div
        className="grid gap-1 rounded-lg border border-neutral-800 bg-neutral-950 p-2"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        role="grid"
      >
        {state.board.map((row, rowIdx) =>
          row.map((cell, colIdx) => {
            const occupied = cell !== null;
            const disabled = finished || busy || occupied;
            return (
              <button
                key={`${rowIdx}-${colIdx}`}
                type="button"
                role="gridcell"
                onClick={() => onCellClick(rowIdx, colIdx)}
                disabled={disabled}
                className={`flex h-20 w-20 items-center justify-center rounded-md text-3xl font-bold transition ${
                  occupied
                    ? "bg-neutral-900 text-neutral-100"
                    : "bg-neutral-800 text-neutral-100 hover:bg-neutral-700"
                } disabled:cursor-not-allowed disabled:opacity-60`}
                aria-label={`Pole wiersz ${rowIdx + 1}, kolumna ${colIdx + 1}${
                  cell ? `, zajęte: ${cell.kind}` : ", puste"
                }`}
              >
                {pieceLabel(cell)}
              </button>
            );
          }),
        )}
      </div>

      {error !== null && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <details className="w-full max-w-md text-sm text-neutral-500">
        <summary className="cursor-pointer">
          Historia ruchów ({state.history.length})
        </summary>
        <ol className="mt-2 list-decimal space-y-1 pl-6 font-mono text-xs">
          {state.history.map((move, idx) => (
            <li key={idx}>{JSON.stringify(move)}</li>
          ))}
        </ol>
      </details>
    </section>
  );
}
