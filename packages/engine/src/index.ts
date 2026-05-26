/**
 * Public entry point for `@game-engine/engine`.
 *
 * For iteration 5 this package ships type contracts only; the runtime
 * (applyMove / validateMove / getOutcome / createInitialState) lands in
 * iteration 6 and will be re-exported from this same file.
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
} from "./types.js";
