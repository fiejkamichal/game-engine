/**
 * Tic-tac-toe game definition.
 *
 * Implements `GameDefinition<TttKind, TttMove>` from `@game-engine/engine`.
 *
 * Rules:
 *   - 3x3 board.
 *   - White (kind "x") moves first; black plays "o".
 *   - One move per turn: place your kind on an empty cell.
 *   - First to align three of their kind on a row, column, or diagonal wins.
 *   - If the board fills with no winner, the match is a draw.
 *
 * The engine handles turn-toggling, persistence, and match-finished checks;
 * everything below is the *semantic* core of tic-tac-toe.
 */

import type {
  Board,
  Cell,
  GameDefinition,
  GameState,
  Outcome,
  Piece,
  Player,
} from "@game-engine/engine";

export type TttKind = "x" | "o";

export interface TttMove {
  readonly kind: "place";
  readonly cell: Cell;
}

export const TIC_TAC_TOE_ID = "tic-tac-toe";

const SIZE = 3;

function buildEmptyBoard(): Board<TttKind> {
  const rows: Array<ReadonlyArray<Piece<TttKind> | null>> = [];
  for (let r = 0; r < SIZE; r++) {
    const row: Array<Piece<TttKind> | null> = [];
    for (let c = 0; c < SIZE; c++) row.push(null);
    rows.push(row);
  }
  return rows;
}

function kindForPlayer(player: Player): TttKind {
  return player === "white" ? "x" : "o";
}

function getCell(
  board: Board<TttKind>,
  cell: Cell,
): Piece<TttKind> | null | undefined {
  const row = board[cell.row];
  if (row === undefined) return undefined;
  return row[cell.col];
}

function setCell(
  board: Board<TttKind>,
  cell: Cell,
  piece: Piece<TttKind>,
): Board<TttKind> {
  return board.map((row, rowIdx) =>
    rowIdx === cell.row
      ? row.map((existing, colIdx) =>
          colIdx === cell.col ? piece : existing,
        )
      : row,
  );
}

const WINNING_LINES: ReadonlyArray<ReadonlyArray<Cell>> = (() => {
  const lines: Array<ReadonlyArray<Cell>> = [];
  for (let r = 0; r < SIZE; r++) {
    const line: Array<Cell> = [];
    for (let c = 0; c < SIZE; c++) line.push({ row: r, col: c });
    lines.push(line);
  }
  for (let c = 0; c < SIZE; c++) {
    const line: Array<Cell> = [];
    for (let r = 0; r < SIZE; r++) line.push({ row: r, col: c });
    lines.push(line);
  }
  const mainDiag: Array<Cell> = [];
  const antiDiag: Array<Cell> = [];
  for (let i = 0; i < SIZE; i++) {
    mainDiag.push({ row: i, col: i });
    antiDiag.push({ row: i, col: SIZE - 1 - i });
  }
  lines.push(mainDiag, antiDiag);
  return lines;
})();

function lineWinner(
  board: Board<TttKind>,
  line: ReadonlyArray<Cell>,
): Player | null {
  const first = line[0];
  if (first === undefined) return null;
  const firstPiece = getCell(board, first);
  if (!firstPiece) return null;
  for (let i = 1; i < line.length; i++) {
    const cell = line[i];
    if (cell === undefined) return null;
    const piece = getCell(board, cell);
    if (!piece || piece.owner !== firstPiece.owner) {
      return null;
    }
  }
  return firstPiece.owner;
}

function isBoardFull(board: Board<TttKind>): boolean {
  for (const row of board) {
    for (const cell of row) {
      if (cell === null) return false;
    }
  }
  return true;
}

export const ticTacToe: GameDefinition<TttKind, TttMove> = {
  id: TIC_TAC_TOE_ID,
  displayName: "Kółko i krzyżyk",
  boardSize: { rows: SIZE, cols: SIZE },

  initialState(matchId): GameState<TttKind, TttMove> {
    return {
      schemaVersion: 1,
      gameId: TIC_TAC_TOE_ID,
      matchId,
      board: buildEmptyBoard(),
      currentPlayer: "white",
      outcome: { status: "ongoing" },
      history: [],
    };
  },

  validateMove(state, move) {
    if (move.kind !== "place") {
      return `Unknown move kind for tic-tac-toe: ${String(move.kind)}.`;
    }
    const { row, col } = move.cell;
    if (!Number.isInteger(row) || !Number.isInteger(col)) {
      return `Cell coordinates must be integers (got row=${row}, col=${col}).`;
    }
    if (row < 0 || row >= SIZE || col < 0 || col >= SIZE) {
      return `Cell (${row}, ${col}) is out of bounds for a ${SIZE}x${SIZE} board.`;
    }
    if (getCell(state.board, move.cell) !== null) {
      return `Cell (${row}, ${col}) is already occupied.`;
    }
    return null;
  },

  applyMove(state, move): GameState<TttKind, TttMove> {
    const piece: Piece<TttKind> = {
      owner: state.currentPlayer,
      kind: kindForPlayer(state.currentPlayer),
    };
    return {
      ...state,
      board: setCell(state.board, move.cell, piece),
      history: [...state.history, move],
    };
  },

  getOutcome(state): Outcome {
    for (const line of WINNING_LINES) {
      const winner = lineWinner(state.board, line);
      if (winner !== null) return { status: "win", winner };
    }
    if (isBoardFull(state.board)) return { status: "draw" };
    return { status: "ongoing" };
  },
};
