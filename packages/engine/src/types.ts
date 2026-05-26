/**
 * Core type contracts shared between the engine and every game.
 *
 * The engine treats games as opaque rule providers parameterized over two type
 * variables:
 *   - `TKind`: the union of piece kinds a game uses (e.g. "x" | "o" for
 *     tic-tac-toe; "man" | "king" for checkers).
 *   - `TMove`: the discriminated union of move shapes a game accepts.
 *
 * The engine reads only structural shape (kind discriminator, cell coordinates,
 * current player). All semantic rules live in the game's `GameDefinition`.
 *
 * See `docs/architecture/0001-engine-vs-game-split.md` for the rationale and
 * `docs/architecture/0002-game-definition-contract.md` for the move-flow
 * protocol.
 */

/** The two players the engine knows about. `white` always moves first. */
export type Player = "white" | "black";

/** Square board dimensions. Engine assumes `rows >= 1 && cols >= 1`. */
export interface BoardSize {
  readonly rows: number;
  readonly cols: number;
}

/** Zero-indexed cell coordinate. Row 0 is the top of the board, col 0 is the left. */
export interface Cell {
  readonly row: number;
  readonly col: number;
}

/**
 * A piece on the board. `owner` is the structural fact the engine cares about
 * (turn-switching, win-detection routing). `kind` is the game-specific tag
 * (e.g. "x", "o", "man", "king") — the engine treats it as an opaque string.
 */
export interface Piece<TKind extends string = string> {
  readonly owner: Player;
  readonly kind: TKind;
}

/** A board cell: a piece or empty. */
export type BoardCell<TKind extends string = string> = Piece<TKind> | null;

/**
 * The board itself, as a dense 2D array indexed `[row][col]`.
 *
 * Readonly nesting prevents accidental in-place mutation: applying a move
 * always produces a new `GameState` rather than mutating the previous one.
 */
export type Board<TKind extends string = string> = ReadonlyArray<
  ReadonlyArray<BoardCell<TKind>>
>;

/**
 * Base shape every move must extend. The `kind` field is the discriminator the
 * engine routes on. Games define their own move union (see D9 in the action
 * plan).
 *
 * Example for tic-tac-toe:
 *   type TttMove = { readonly kind: "place"; readonly cell: Cell };
 *
 * Example for checkers:
 *   type CheckersMove =
 *     | { readonly kind: "step"; readonly from: Cell; readonly to: Cell }
 *     | { readonly kind: "capture"; readonly from: Cell; readonly to: Cell; readonly captured: Cell };
 */
export interface Move {
  readonly kind: string;
}

/**
 * The decided/undecided status of a match.
 *
 * `ongoing` — keep playing.
 * `win`     — `winner` claimed the match; no further moves accepted.
 * `draw`    — neither player can win from here; no further moves accepted.
 */
export type Outcome =
  | { readonly status: "ongoing" }
  | { readonly status: "win"; readonly winner: Player }
  | { readonly status: "draw" };

/**
 * The full persisted state of a single match. This is exactly what is written
 * to `data/matches/{matchId}.json` (D7) — readable by humans, parseable by the
 * engine on reload.
 *
 * `schemaVersion` exists so the engine can refuse / migrate older match files
 * cleanly when the contract evolves; bump on any breaking change to this
 * shape.
 */
export interface GameState<
  TKind extends string = string,
  TMove extends Move = Move,
> {
  readonly schemaVersion: 1;
  readonly gameId: string;
  readonly matchId: string;
  readonly board: Board<TKind>;
  readonly currentPlayer: Player;
  readonly outcome: Outcome;
  readonly history: ReadonlyArray<TMove>;
}

/**
 * A structured error returned when a move is rejected.
 *
 * `structural`     — engine-level rejection (cell out of bounds, wrong
 *                    player's turn, malformed move payload).
 * `semantic`       — game-level rejection (the game's `validateMove` said no:
 *                    illegal capture, blocked path, etc.).
 * `match-finished` — the match's outcome is already decided; the engine
 *                    refuses further moves.
 */
export interface MoveError {
  readonly code: "structural" | "semantic" | "match-finished";
  readonly reason: string;
}

/** Discriminated result of attempting a move. */
export type MoveResult<
  TKind extends string = string,
  TMove extends Move = Move,
> =
  | { readonly ok: true; readonly state: GameState<TKind, TMove> }
  | { readonly ok: false; readonly error: MoveError };

/**
 * The contract every game in `packages/games/<game>/` must export.
 *
 * The engine flow per move (see ADR 0002):
 *   1. Engine structural checks (match ongoing, cell in bounds, right player's turn).
 *   2. `validateMove(state, move)` — game-specific semantic check.
 *   3. `applyMove(state, move)` — game returns the new board+history.
 *   4. `getOutcome(state)` — engine asks the game whether the match is decided.
 *   5. Engine toggles `currentPlayer` (if still `ongoing`) and persists to disk.
 *
 * Adding a third game requires zero engine changes — only a new
 * `packages/games/<new>/` exporting a `GameDefinition`. That is the
 * architectural punchline of the workshop (see ADR 0001).
 */
export interface GameDefinition<
  TKind extends string = string,
  TMove extends Move = Move,
> {
  /** Stable identifier; must match the `gameId` field in any persisted match. */
  readonly id: string;

  /** Human-facing label, used in the games list UI. Can be localized. */
  readonly displayName: string;

  /** Board dimensions; the engine uses this to validate cell coordinates structurally. */
  readonly boardSize: BoardSize;

  /**
   * Build the initial state for a new match. The engine has already chosen the
   * `matchId`; the game decides the starting board layout and which player
   * moves first (defaults to `white`).
   */
  readonly initialState: (matchId: string) => GameState<TKind, TMove>;

  /**
   * Semantic legality check. Return `null` if the move is legal in the current
   * state, or a short human-readable reason if not. The engine will wrap that
   * reason in a `MoveError` with `code: "semantic"`.
   */
  readonly validateMove: (
    state: GameState<TKind, TMove>,
    move: TMove,
  ) => string | null;

  /**
   * Apply a move that has already passed `validateMove`. Must return a new
   * `GameState` (immutable update). Engine appends the move to `history` and
   * toggles `currentPlayer` after `getOutcome` runs.
   */
  readonly applyMove: (
    state: GameState<TKind, TMove>,
    move: TMove,
  ) => GameState<TKind, TMove>;

  /**
   * Inspect the post-move state and decide whether the match is decided.
   * Called by the engine after every successful `applyMove`. Should be a pure
   * function of `state.board` and `state.history`.
   */
  readonly getOutcome: (state: GameState<TKind, TMove>) => Outcome;
}
