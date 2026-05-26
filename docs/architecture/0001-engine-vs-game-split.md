# ADR 0001 — Engine vs game split

## Status

Accepted — 2026-05-26.

## Context

The workshop "AI Generation w praktyce" needs a runnable example of a clean
multi-module architecture so participants can see — not just hear — how
multi-agent AI roles map onto module boundaries. The product is a turn-based
game engine with at least two reference games (tic-tac-toe and checkers).

The architectural question we must answer before writing any code: **where
does the line between shared/structural code and game-specific rules sit?**

The bootstrap prompt (section 4.1) and decision D10 in the action plan
already hint at the answer — the engine knows only "two players, turn-based,
square board, pieces colored white/black, clickability". But we need to
commit to that line in writing because every later iteration (engine
runtime, two games, UI) depends on it.

## Decision

We split the codebase into two layers with a one-way dependency:

```
packages/engine/        — game-agnostic.  Knows: 2 players, turns,
                          square board, pieces with owner+kind, clickability,
                          persistence shape.  Never imports a game module.

packages/games/<game>/  — game-specific. Implements `GameDefinition` from
                          `@game-engine/engine`. Owns: legality of moves,
                          win conditions, starting layout, piece kinds.
```

- **Engine knows** which player's turn it is, that the board is a 2D grid,
  and how to persist `GameState` to `data/matches/{matchId}.json`.
- **Game knows** what a move means semantically, when someone has won, and
  what pieces start where.
- **The engine asks the game** for two things and two things only:
  `validateMove(state, move)` and `getOutcome(state)`. Plus a one-shot
  `initialState(matchId)` at match creation and `applyMove(state, move)` to
  produce the post-move board. See ADR 0002 for the full contract.
- **The dependency arrow is one-way:** `packages/games/*/` may import from
  `@game-engine/engine`, never the other way. The engine never imports a
  specific game; a registry of games is assembled by the app layer
  (`apps/web/`) at module load time.

## Alternatives considered

### Alt A — No shared engine; each game is fully self-contained

Every game ships its own board model, persistence code, and turn logic.

Rejected because:

- The workshop's central architectural punchline is "one engine, many games";
  removing the engine removes the lesson.
- Adding a third game would mean copy-pasting the persistence + turn-toggling
  scaffolding for the third time — exactly the duplication the workshop is
  meant to warn against.
- The engine layer is roughly 100 LoC. Avoiding it costs more than writing
  it.

### Alt B — Engine has a `gameKind` switch baked in

The engine contains `if (state.gameId === "tic-tac-toe") … else if (state.gameId === "checkers") …`
inside its core methods.

Rejected because:

- Anti-pattern that every workshop participant will recognize: the engine
  grows linearly with the number of games, violating open-closed.
- Adding a third game means editing the engine. That breaks the DoD of
  iteration 7 ("diff względem iteracji 6 nie dotyka `packages/engine/`")
  and removes the architectural sign of quality the prompt asked for.
- Makes the "skill vs agent vs module boundary" parallel in the
  presentation harder to draw: there is no clean boundary to point at.

### Alt C — Engine ships a rule-script DSL; games are data files only

Games declare their rules as JSON / a small DSL the engine interprets.

Rejected because:

- For a 1.5h workshop this is overengineering by an order of magnitude. The
  DSL would need to express "captures along a diagonal", "kings that change
  direction", "three-in-a-row on any axis" — all of which TypeScript already
  expresses for free with discriminated unions.
- Participants would learn a custom DSL instead of the multi-agent
  architecture story the workshop is actually about.

### Alt D — Engine knows board structure but games extend the engine class

Object-oriented `class TicTacToe extends Engine { … }`.

Rejected because:

- Subclassing forces a `this`-based call style that does not serialize
  cleanly. `GameState` is JSON on disk (D7); methods do not survive a
  round-trip.
- Inheritance hides the contract: it is hard to point at "the API a game
  must implement" if it is spread across virtual methods. A plain
  `GameDefinition` interface is one screenful of code, which is what we
  need on a slide.

## Consequences

### Positive

- **Architectural punchline lands.** "Adding a third game requires zero
  changes under `packages/engine/`" is a verifiable claim: iteration 7's
  DoD checks exactly that with a diff.
- **Roles map cleanly onto modules.** Architect owns
  `packages/engine/src/types.ts` and the ADRs; Backend owns the engine
  runtime and the persistence; the Frontend owns
  `apps/web/app/components/`; games are leaf modules an Architect+Backend
  pair can write in 30–80 LoC each.
- **Persistence is trivial.** `GameState` is plain data, so
  `data/matches/{id}.json` is human-readable JSON with no custom
  serializer.
- **No premature performance work.** The engine has no game-specific fast
  paths; the few-cells-per-board workloads we target make that fine.

### Negative

- **No engine-side optimization knobs for games.** A future fast checkers
  bot cannot push specialized move-generation back into the engine. Out of
  scope for the workshop; a real production engine might break this rule.
- **Some duplication across games.** Both tic-tac-toe and checkers will
  write a small "validate this cell is in range" helper because such
  helpers cannot live in the engine without leaking game intent. Acceptable
  cost for the architectural clarity we get.
- **The contract must be right.** Because games depend on `GameDefinition`
  and the engine refuses to import them, breaking changes to the contract
  ripple through every game. Every contract change therefore needs an ADR
  (see ADR 0002 and onwards).

## References

- Action plan: `workshop/plan/01-action-plan.md` — decision D10, iterations
  6 and 7.
- Bootstrap prompt: `workshop/plan/00-bootstrap-prompt.md` — sections 4.1
  and 4.3.
- Type contract: `packages/engine/src/types.ts`.
- Follow-up: ADR 0002 — the `GameDefinition` contract and the move flow.
