/**
 * Engine runtime for `@game-engine/engine`.
 *
 * Implements the six-step move-flow protocol described in
 * `docs/architecture/0002-game-definition-contract.md`.
 *
 * Boundary: this module knows only structural facts (whose turn it is, that
 * the match has an outcome) and routes everything else to the game. It must
 * never import a specific game.
 */

import type {
  GameDefinition,
  GameState,
  Move,
  MoveResult,
  Player,
} from "./types";

/** Switch between the two players. `white` <-> `black`. */
export function togglePlayer(player: Player): Player {
  return player === "white" ? "black" : "white";
}

/**
 * Build the initial state for a new match by delegating to the game's own
 * `initialState`. The engine assigns the `matchId`; the game decides starting
 * board layout and which player moves first.
 */
export function createInitialState<TKind extends string, TMove extends Move>(
  game: GameDefinition<TKind, TMove>,
  matchId: string,
): GameState<TKind, TMove> {
  return game.initialState(matchId);
}

/**
 * Apply a move to a match state. Returns a `MoveResult` that is either:
 *   - `{ ok: true, state }`  — the new `GameState` after the move
 *   - `{ ok: false, error }` — a structured `MoveError` explaining why
 *
 * The engine owns `currentPlayer` toggling: the game's `applyMove` may leave
 * `currentPlayer` to anything, this engine overwrites it post-outcome based
 * on the state that came *into* this function.
 */
export function applyMove<TKind extends string, TMove extends Move>(
  game: GameDefinition<TKind, TMove>,
  state: GameState<TKind, TMove>,
  move: TMove,
): MoveResult<TKind, TMove> {
  if (state.outcome.status !== "ongoing") {
    return {
      ok: false,
      error: {
        code: "match-finished",
        reason: `Match is already ${state.outcome.status}; no further moves accepted.`,
      },
    };
  }

  if (typeof move.kind !== "string" || move.kind.length === 0) {
    return {
      ok: false,
      error: {
        code: "structural",
        reason: "Move payload is missing a non-empty `kind` discriminator.",
      },
    };
  }

  const semanticReason = game.validateMove(state, move);
  if (semanticReason !== null) {
    return {
      ok: false,
      error: { code: "semantic", reason: semanticReason },
    };
  }

  const afterMove = game.applyMove(state, move);
  const outcome = game.getOutcome(afterMove);
  const nextPlayer: Player =
    outcome.status === "ongoing"
      ? togglePlayer(state.currentPlayer)
      : state.currentPlayer;

  return {
    ok: true,
    state: {
      ...afterMove,
      outcome,
      currentPlayer: nextPlayer,
    },
  };
}
