"use client";

import { useTranslations } from "next-intl";
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

type BoardTranslator = ReturnType<typeof useTranslations>;

function playerLabel(player: string, t: BoardTranslator): string {
  const key = `player.${player}`;
  return t.has(key) ? t(key) : player;
}

interface StatusBanner {
  readonly prefix: string;
  readonly value: string;
  readonly tone: "ongoing" | "win" | "draw";
}

function statusBanner(state: GameState, t: BoardTranslator): StatusBanner {
  switch (state.outcome.status) {
    case "ongoing":
      return {
        prefix: t("turn"),
        value: playerLabel(state.currentPlayer, t),
        tone: "ongoing",
      };
    case "win":
      return {
        prefix: t("winner"),
        value: playerLabel(state.outcome.winner, t),
        tone: "win",
      };
    case "draw":
      return { prefix: t("result"), value: t("draw"), tone: "draw" };
  }
}

function toneColor(tone: StatusBanner["tone"]): string {
  switch (tone) {
    case "win":
      return "var(--accent-3)";
    case "draw":
      return "var(--accent-2)";
    case "ongoing":
      return "var(--fg)";
  }
}

export function MatchBoard({ initialState }: Props) {
  const t = useTranslations("board");
  const tGameUi = useTranslations("gameUi");
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
      setError(err instanceof Error ? err.message : t("unknownError"));
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
    setError(tGameUi(result.errorKey));
  }

  function isSelected(row: number, col: number): boolean {
    return selectedCells.some((c) => c.row === row && c.col === col);
  }

  const finished = state.outcome.status !== "ongoing";
  const cols = state.board[0]?.length ?? 1;
  const cellSize = cols <= 4 ? "h-20 w-20 text-3xl" : "h-12 w-12 text-xl";

  const banner = statusBanner(state, t);

  return (
    <section
      aria-label={t("label")}
      className="flex flex-col items-center gap-6"
    >
      <p
        className="text-lg font-medium tracking-wide"
        style={{ color: toneColor(banner.tone) }}
        aria-live="polite"
      >
        <span className="text-fg-3 text-sm font-normal tracking-[0.25em] uppercase">
          {banner.prefix}{" "}
        </span>
        <span className="accent ml-1 text-xl">{banner.value}</span>
      </p>

      <div
        className="card-flat !p-2"
        role="grid"
        style={{ width: "fit-content" }}
      >
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
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
                ? "ring-2 ring-[var(--accent)] shadow-[0_0_18px_var(--accent-glow)]"
                : "ring-1 ring-[var(--border)]";

              return (
                <button
                  key={`${rowIdx}-${colIdx}`}
                  type="button"
                  role="gridcell"
                  onClick={() => onCellClick(rowIdx, colIdx)}
                  disabled={disabled}
                  className={`flex items-center justify-center rounded-md font-bold transition ${cellSize} ${baseCellClass} ${ringClass} disabled:cursor-not-allowed disabled:opacity-70`}
                  aria-label={`${
                    cell
                      ? t("cellOccupied", {
                          row: rowIdx + 1,
                          col: colIdx + 1,
                          owner: cell.owner,
                          kind: cell.kind,
                        })
                      : t("cellEmpty", { row: rowIdx + 1, col: colIdx + 1 })
                  }${selected ? t("cellSelectedSuffix") : ""}`}
                >
                  <span className={pieceRender?.className ?? ""}>
                    {pieceRender?.label ?? ""}
                  </span>
                </button>
              );
            }),
          )}
        </div>
      </div>

      {selectedCells.length > 0 && !finished && (
        <p
          className="text-sm"
          style={{ color: "var(--accent)" }}
          aria-live="polite"
        >
          {t("selectionProgress", {
            selected: selectedCells.length,
            max: ui.maxSelection,
            remaining: ui.maxSelection - selectedCells.length,
          })}
        </p>
      )}

      {error !== null && (
        <div className="card bad w-full max-w-xl" role="alert">
          <p style={{ color: "var(--danger)" }}>{error}</p>
        </div>
      )}

      <details className="w-full max-w-xl">
        <summary
          className="text-fg-3 cursor-pointer text-sm tracking-[0.18em] uppercase"
          style={{ letterSpacing: "0.2em" }}
        >
          {t("historyTitle", { count: state.history.length })}
        </summary>
        <pre className="text-xs">
          {state.history.length === 0
            ? t("historyEmpty")
            : state.history
                .map((move, idx) => `${idx + 1}. ${JSON.stringify(move)}`)
                .join("\n")}
        </pre>
      </details>
    </section>
  );
}
