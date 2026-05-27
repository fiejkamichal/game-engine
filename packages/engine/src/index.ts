/**
 * Public entry point for `@game-engine/engine`.
 *
 * Exposes:
 *   - Type contracts (`GameDefinition`, `GameState`, `Move`, ...) — the
 *     surface every game implements and every consumer reads.
 *   - Engine runtime (`applyMove`, `createInitialState`, `togglePlayer`) —
 *     the implementation of the six-step move-flow from ADR 0002.
 *
 * See `docs/architecture/0001-engine-vs-game-split.md` for the rationale.
 */

export type {
  Board,
  BoardCell,
  BoardSize,
  Cell,
  GameDefinition,
  GameState,
  Move,
  MoveError,
  MoveResult,
  Outcome,
  Piece,
  Player,
} from "./types";

export { applyMove, createInitialState, togglePlayer } from "./engine";
