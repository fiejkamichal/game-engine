/**
 * Registry of available games.
 *
 * The engine deliberately knows no specific game (see ADR 0001). The app
 * layer assembles the registry by importing each game module and registering
 * it here. Adding a third game = one import + one `register(...)` call.
 */

import type { GameDefinition, Move } from "@game-engine/engine";
import { checkers } from "@game-engine/checkers";
import { ticTacToe } from "@game-engine/tic-tac-toe";

const registry = new Map<string, GameDefinition>();

function register<TKind extends string, TMove extends Move>(
  game: GameDefinition<TKind, TMove>,
): void {
  registry.set(game.id, game as unknown as GameDefinition);
}

register(ticTacToe);
register(checkers);

export function getGame(gameId: string): GameDefinition | null {
  return registry.get(gameId) ?? null;
}

export interface GameSummary {
  readonly id: string;
  readonly displayName: string;
  readonly boardSize: { readonly rows: number; readonly cols: number };
}

export function listGames(): ReadonlyArray<GameSummary> {
  return Array.from(registry.values()).map((g) => ({
    id: g.id,
    displayName: g.displayName,
    boardSize: { rows: g.boardSize.rows, cols: g.boardSize.cols },
  }));
}
