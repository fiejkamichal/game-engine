"use client";

import { useState } from "react";

import type {
  Cell,
  GameState,
  Move,
  MoveError,
} from "@game-engine/engine";

import { getGameUi } from "@/lib/games-ui";

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
  const [selectedCells, setSelectedCells] = useState<ReadonlyArray<Cell>>([]);

  const ui = getGameUi(state.gameId);

  async function sendMove(move: Move) {
    setBusy(true);
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
    if (busy) return;
    if (state.outcome.status !== "ongoing") return;

    const cell: Cell = { row, col };
    const nextSelection = [...selectedCells, cell];
    const result = ui.buildMove(state, nextSelection);

    if (result.status === "ready") {
      setSelectedCells([]);
      setError(null);
      void sendMove(result.move);
      return;
    }
    if (result.status === "need-more") {
      setSelectedCells(nextSelection);
      setError(null);
      return;
    }
    setSelectedCells([]);
    setError(result.error);
  }

  function isSelected(row: number, col: number): boolean {
    return selectedCells.some((c) => c.row === row && c.col === col);
  }

  const finished = state.outcome.status !== "ongoing";
  const cols = state.board[0]?.length ?? 1;
  const cellSize = cols <= 4 ? "h-20 w-20 text-3xl" : "h-12 w-12 text-xl";

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
            const selected = isSelected(rowIdx, colIdx);
            const disabled = finished || busy;
            const baseCellClass = ui.boardCellClass({
              row: rowIdx,
              col: colIdx,
            });
            const pieceRender = cell !== null ? ui.renderPiece(cell) : null;
            const ringClass = selected
              ? "ring-2 ring-sky-400"
              : "ring-1 ring-neutral-700/50";

            return (
              <button
                key={`${rowIdx}-${colIdx}`}
                type="button"
                role="gridcell"
                onClick={() => onCellClick(rowIdx, colIdx)}
                disabled={disabled}
                className={`flex items-center justify-center rounded-md font-bold transition ${cellSize} ${baseCellClass} ${ringClass} disabled:cursor-not-allowed disabled:opacity-70`}
                aria-label={`Pole wiersz ${rowIdx + 1}, kolumna ${colIdx + 1}${
                  cell ? `, zajęte: ${cell.owner} ${cell.kind}` : ", puste"
                }${selected ? ", zaznaczone" : ""}`}
              >
                <span className={pieceRender?.className ?? ""}>
                  {pieceRender?.label ?? ""}
                </span>
              </button>
            );
          }),
        )}
      </div>

      {selectedCells.length > 0 && !finished && (
        <p className="text-sm text-sky-300" aria-live="polite">
          Zaznaczono {selectedCells.length} z {ui.maxSelection} pól. Kliknij{" "}
          {ui.maxSelection - selectedCells.length === 1
            ? "ostatnie pole"
            : `${ui.maxSelection - selectedCells.length} kolejnych pól`}{" "}
          aby dokończyć ruch.
        </p>
      )}

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
