/**
 * Per-game UI helpers.
 *
 * The engine deliberately knows nothing about clicks or styling (ADR 0001).
 * Game packages also stay UI-agnostic (they describe rules, not pixels).
 * This file is the *app-layer* bridge: it tells the React board how a
 * sequence of clicked cells maps to a `Move` and how each piece should look.
 *
 * Adding a third game means: implement `GameUiHelpers` for it and register
 * the entry below. No change to the engine, no change to the board
 * component, no `if gameId === ...` branches in the UI.
 */

import type { Cell, GameState, Move, Piece } from "@game-engine/engine";
import { CHECKERS_ID } from "@game-engine/checkers";
import { TIC_TAC_TOE_ID } from "@game-engine/tic-tac-toe";

export type MoveBuildResult =
  | { readonly status: "ready"; readonly move: Move }
  | { readonly status: "need-more" }
  | { readonly status: "reset"; readonly error: string };

export interface PieceRender {
  readonly label: string;
  readonly className: string;
}

export interface GameUiHelpers {
  /** How many cells the user clicks before a move is fully described. */
  readonly maxSelection: number;
  /**
   * Translate a sequence of clicked cells into a `Move`.
   *
   * Return:
   *   - `{ status: "ready", move }`  — submit this move to the API
   *   - `{ status: "need-more" }`    — keep the selection, wait for next click
   *   - `{ status: "reset", error }` — clear the selection, show the error
   */
  readonly buildMove: (
    state: GameState,
    cells: ReadonlyArray<Cell>,
  ) => MoveBuildResult;
  /** How to render a piece (label inside the cell + its className). */
  readonly renderPiece: (piece: Piece) => PieceRender;
  /** Background class for a board cell (e.g. alternating dark/light squares). */
  readonly boardCellClass: (cell: Cell) => string;
}

function pieceAt(state: GameState, cell: Cell): Piece | null {
  const row = state.board[cell.row];
  if (row === undefined) return null;
  return row[cell.col] ?? null;
}

const ticTacToeUi: GameUiHelpers = {
  maxSelection: 1,
  buildMove(_state, cells) {
    const cell = cells[cells.length - 1];
    if (cell === undefined) return { status: "need-more" };
    const move = { kind: "place", cell };
    return { status: "ready", move };
  },
  renderPiece(piece) {
    return {
      label: piece.kind.toUpperCase(),
      className:
        piece.owner === "white"
          ? "text-[var(--accent)]"
          : "text-[var(--accent-2)]",
    };
  },
  boardCellClass(_cell) {
    return "bg-[var(--board-dark)] hover:bg-[var(--board-dark-hover)]";
  },
};

const checkersUi: GameUiHelpers = {
  maxSelection: 2,
  buildMove(state, cells) {
    if (cells.length === 0) return { status: "need-more" };

    const from = cells[0];
    if (from === undefined) return { status: "need-more" };

    if (cells.length === 1) {
      const piece = pieceAt(state, from);
      if (piece === null) {
        return { status: "reset", error: "Pole jest puste. Wybierz swoją figurę." };
      }
      if (piece.owner !== state.currentPlayer) {
        return { status: "reset", error: "To nie jest twoja figura." };
      }
      return { status: "need-more" };
    }

    const to = cells[cells.length - 1];
    if (to === undefined) return { status: "need-more" };

    const dr = to.row - from.row;
    const dc = to.col - from.col;

    if (Math.abs(dr) === 1 && Math.abs(dc) === 1) {
      const move = { kind: "step", from, to };
      return { status: "ready", move };
    }
    if (Math.abs(dr) === 2 && Math.abs(dc) === 2) {
      const captured: Cell = {
        row: from.row + dr / 2,
        col: from.col + dc / 2,
      };
      const move = { kind: "capture", from, to, captured };
      return { status: "ready", move };
    }
    return {
      status: "reset",
      error: "Ruch musi być po skosie o 1 pole (krok) lub 2 pola (bicie).",
    };
  },
  renderPiece(piece) {
    const label = piece.kind === "king" ? "♛" : "●";
    const className =
      piece.owner === "white"
        ? "text-[var(--accent)] drop-shadow-[0_0_10px_var(--accent-glow)]"
        : "text-[var(--accent-2)] drop-shadow-[0_0_10px_var(--accent-glow-2)]";
    return { label, className };
  },
  boardCellClass(cell) {
    const isDark = (cell.row + cell.col) % 2 === 1;
    return isDark
      ? "bg-[var(--board-dark)] hover:bg-[var(--board-dark-hover)]"
      : "bg-[var(--board-light)] hover:bg-[var(--board-light-hover)]";
  },
};

const fallbackUi: GameUiHelpers = {
  maxSelection: 1,
  buildMove(_state, cells) {
    const cell = cells[cells.length - 1];
    if (cell === undefined) return { status: "need-more" };
    const move = { kind: "place", cell };
    return { status: "ready", move };
  },
  renderPiece(piece) {
    return { label: piece.kind, className: "text-[var(--fg)]" };
  },
  boardCellClass(_cell) {
    return "bg-[var(--board-dark)] hover:bg-[var(--board-dark-hover)]";
  },
};

const registry = new Map<string, GameUiHelpers>([
  [TIC_TAC_TOE_ID, ticTacToeUi],
  [CHECKERS_ID, checkersUi],
]);

export function getGameUi(gameId: string): GameUiHelpers {
  return registry.get(gameId) ?? fallbackUi;
}
