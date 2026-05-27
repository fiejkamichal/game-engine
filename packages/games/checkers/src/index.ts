/**
 * Minimal checkers game definition.
 *
 * Implements `GameDefinition<CheckersKind, CheckersMove>` from
 * `@game-engine/engine`. Architectural point of iteration 7:
 * adding this package required zero changes under `packages/engine/`.
 *
 * Rules (workshop-grade minimal variant):
 *   - 8x8 board, pieces sit on dark squares only.
 *   - White moves first.
 *   - White starts on rows 5-7 dark squares; black on rows 0-2.
 *   - Men move 1 diagonally forward (white toward row 0, black toward row 7).
 *   - Kings move 1 diagonally in any direction.
 *   - Captures jump 2 diagonally over an opponent piece into an empty cell.
 *   - Captures are mandatory: if a capture is available, only captures may
 *     be played that turn.
 *   - No multi-jump chains in this variant; one capture per turn.
 *   - A man that lands on the opposite back rank promotes to king.
 *   - Win condition: opponent has no pieces or no legal move on their turn.
 */

import type {
  Board,
  BoardCell,
  Cell,
  GameDefinition,
  GameState,
  Outcome,
  Piece,
  Player,
} from "@game-engine/engine";
import { togglePlayer } from "@game-engine/engine";

export type CheckersKind = "man" | "king";

export interface CheckersStepMove {
  readonly kind: "step";
  readonly from: Cell;
  readonly to: Cell;
}

export interface CheckersCaptureMove {
  readonly kind: "capture";
  readonly from: Cell;
  readonly to: Cell;
  readonly captured: Cell;
}

export type CheckersMove = CheckersStepMove | CheckersCaptureMove;

export const CHECKERS_ID = "checkers";

const SIZE = 8;

function isInBounds(cell: Cell): boolean {
  return cell.row >= 0 && cell.row < SIZE && cell.col >= 0 && cell.col < SIZE;
}

function isDarkSquare(cell: Cell): boolean {
  return (cell.row + cell.col) % 2 === 1;
}

function pieceAt(
  board: Board<CheckersKind>,
  cell: Cell,
): Piece<CheckersKind> | null {
  if (!isInBounds(cell)) return null;
  const row = board[cell.row];
  if (row === undefined) return null;
  return row[cell.col] ?? null;
}

function setCellOn(
  board: Board<CheckersKind>,
  cell: Cell,
  value: BoardCell<CheckersKind>,
): Board<CheckersKind> {
  return board.map((row, rowIdx) =>
    rowIdx === cell.row
      ? row.map((existing, colIdx) =>
          colIdx === cell.col ? value : existing,
        )
      : row,
  );
}

function forwardDirection(player: Player): -1 | 1 {
  return player === "white" ? -1 : 1;
}

function promotionRow(player: Player): number {
  return player === "white" ? 0 : SIZE - 1;
}

/** Diagonal offsets a piece may move along (without considering distance). */
function diagonalsFor(piece: Piece<CheckersKind>): ReadonlyArray<[number, number]> {
  if (piece.kind === "king") {
    return [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ];
  }
  const dr = forwardDirection(piece.owner);
  return [
    [dr, -1],
    [dr, 1],
  ];
}

function buildInitialBoard(): Board<CheckersKind> {
  const rows: Array<ReadonlyArray<BoardCell<CheckersKind>>> = [];
  for (let r = 0; r < SIZE; r++) {
    const row: Array<BoardCell<CheckersKind>> = [];
    for (let c = 0; c < SIZE; c++) {
      const cell: Cell = { row: r, col: c };
      if (!isDarkSquare(cell)) {
        row.push(null);
        continue;
      }
      if (r <= 2) row.push({ owner: "black", kind: "man" });
      else if (r >= 5) row.push({ owner: "white", kind: "man" });
      else row.push(null);
    }
    rows.push(row);
  }
  return rows;
}

function stepsFrom(
  board: Board<CheckersKind>,
  from: Cell,
): ReadonlyArray<CheckersStepMove> {
  const piece = pieceAt(board, from);
  if (!piece) return [];
  const out: Array<CheckersStepMove> = [];
  for (const [dr, dc] of diagonalsFor(piece)) {
    const to: Cell = { row: from.row + dr, col: from.col + dc };
    if (!isInBounds(to)) continue;
    if (pieceAt(board, to) !== null) continue;
    out.push({ kind: "step", from, to });
  }
  return out;
}

function capturesFrom(
  board: Board<CheckersKind>,
  from: Cell,
): ReadonlyArray<CheckersCaptureMove> {
  const piece = pieceAt(board, from);
  if (!piece) return [];
  const out: Array<CheckersCaptureMove> = [];
  for (const [dr, dc] of diagonalsFor(piece)) {
    const mid: Cell = { row: from.row + dr, col: from.col + dc };
    const to: Cell = { row: from.row + 2 * dr, col: from.col + 2 * dc };
    if (!isInBounds(to)) continue;
    const midPiece = pieceAt(board, mid);
    if (midPiece === null) continue;
    if (midPiece.owner === piece.owner) continue;
    if (pieceAt(board, to) !== null) continue;
    out.push({ kind: "capture", from, to, captured: mid });
  }
  return out;
}

function allMovesFor(
  board: Board<CheckersKind>,
  player: Player,
): {
  readonly steps: ReadonlyArray<CheckersStepMove>;
  readonly captures: ReadonlyArray<CheckersCaptureMove>;
} {
  const steps: Array<CheckersStepMove> = [];
  const captures: Array<CheckersCaptureMove> = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const from: Cell = { row: r, col: c };
      const piece = pieceAt(board, from);
      if (!piece || piece.owner !== player) continue;
      for (const cap of capturesFrom(board, from)) captures.push(cap);
      for (const step of stepsFrom(board, from)) steps.push(step);
    }
  }
  return { steps, captures };
}

function countPieces(board: Board<CheckersKind>, player: Player): number {
  let total = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell !== null && cell.owner === player) total++;
    }
  }
  return total;
}

export const checkers: GameDefinition<CheckersKind, CheckersMove> = {
  id: CHECKERS_ID,
  displayName: "Warcaby",
  boardSize: { rows: SIZE, cols: SIZE },

  initialState(matchId): GameState<CheckersKind, CheckersMove> {
    return {
      schemaVersion: 1,
      gameId: CHECKERS_ID,
      matchId,
      board: buildInitialBoard(),
      currentPlayer: "white",
      outcome: { status: "ongoing" },
      history: [],
    };
  },

  validateMove(state, move) {
    const player = state.currentPlayer;

    if (!isInBounds(move.from) || !isInBounds(move.to)) {
      return "Pole poza planszą.";
    }
    if (!isDarkSquare(move.from) || !isDarkSquare(move.to)) {
      return "Warcaby grają tylko na ciemnych polach.";
    }

    const fromPiece = pieceAt(state.board, move.from);
    if (fromPiece === null) {
      return "Pole startowe jest puste.";
    }
    if (fromPiece.owner !== player) {
      return "To nie jest twoja figura.";
    }
    if (pieceAt(state.board, move.to) !== null) {
      return "Pole docelowe jest zajęte.";
    }

    const dr = move.to.row - move.from.row;
    const dc = move.to.col - move.from.col;

    if (fromPiece.kind === "man") {
      const forward = forwardDirection(player);
      if (Math.sign(dr) !== forward) {
        return "Pionek może iść tylko do przodu.";
      }
    }

    const { captures } = allMovesFor(state.board, player);
    const captureMandatory = captures.length > 0;

    if (move.kind === "step") {
      if (Math.abs(dr) !== 1 || Math.abs(dc) !== 1) {
        return "Krok musi być po skosie o 1 pole.";
      }
      if (captureMandatory) {
        return "Bicie jest obowiązkowe — musisz wykonać bicie.";
      }
      return null;
    }

    if (move.kind === "capture") {
      if (Math.abs(dr) !== 2 || Math.abs(dc) !== 2) {
        return "Bicie musi być po skosie o 2 pola.";
      }
      const expected: Cell = {
        row: move.from.row + dr / 2,
        col: move.from.col + dc / 2,
      };
      if (
        move.captured.row !== expected.row ||
        move.captured.col !== expected.col
      ) {
        return "Pole 'captured' musi leżeć między 'from' a 'to'.";
      }
      const captured = pieceAt(state.board, move.captured);
      if (captured === null) {
        return "Na polu bicia nie ma figury.";
      }
      if (captured.owner === player) {
        return "Nie wolno bić własnych figur.";
      }
      return null;
    }

    return `Nieznany rodzaj ruchu: ${String((move as { kind: unknown }).kind)}.`;
  },

  applyMove(state, move): GameState<CheckersKind, CheckersMove> {
    const piece = pieceAt(state.board, move.from);
    if (piece === null) {
      throw new Error(
        "checkers.applyMove called without a piece at `from`; engine should have rejected this via validateMove.",
      );
    }

    let board: Board<CheckersKind> = setCellOn(state.board, move.from, null);
    if (move.kind === "capture") {
      board = setCellOn(board, move.captured, null);
    }
    const promotes =
      piece.kind === "man" && move.to.row === promotionRow(piece.owner);
    const placed: Piece<CheckersKind> = promotes
      ? { owner: piece.owner, kind: "king" }
      : piece;
    board = setCellOn(board, move.to, placed);

    return {
      ...state,
      board,
      history: [...state.history, move],
    };
  },

  getOutcome(state): Outcome {
    const opponent = togglePlayer(state.currentPlayer);

    if (countPieces(state.board, opponent) === 0) {
      return { status: "win", winner: state.currentPlayer };
    }

    const { steps, captures } = allMovesFor(state.board, opponent);
    if (steps.length === 0 && captures.length === 0) {
      return { status: "win", winner: state.currentPlayer };
    }

    return { status: "ongoing" };
  },
};
