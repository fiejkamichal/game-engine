# define-typescript-contract

Skill for the Architect (primarily) and for any specialist implementing or
consuming a typed contract. Covers discriminated unions, exhaustive
switches, readonly-by-default, and brand types.

## When to use

- You are introducing a new shape that crosses a module boundary
  (engine ↔ game, API ↔ UI, file ↔ runtime).
- You are about to write `type Foo = …` or `interface Foo { … }` and want
  to make wrong states unrepresentable.
- A code review asks "could this value be in state X here?" — that is a
  cue that the type is not yet doing its job.

## Procedure

### 1. Default everything to `readonly`

Mutating state is rarely the bug-cheap option. Make every property and
every array readonly unless there is a measured reason not to.

```ts
interface GameState<TKind, TMove> {
  readonly schemaVersion: 1;
  readonly board: Board<TKind>;                 // ReadonlyArray<ReadonlyArray<…>>
  readonly history: ReadonlyArray<TMove>;
  // …
}
```

### 2. Use discriminated unions for variants

When a value has multiple shapes with mostly disjoint fields, encode the
variant in a literal-typed `kind` (or `status`, `type`, …) discriminator
and union the variants. Avoid optional fields whose presence depends on
another field.

```ts
// Good — Outcome is exactly one of three shapes.
export type Outcome =
  | { readonly status: "ongoing" }
  | { readonly status: "win"; readonly winner: Player }
  | { readonly status: "draw" };

// Bad — `winner` may or may not be present; impossible to narrow safely.
export interface Outcome {
  readonly status: "ongoing" | "win" | "draw";
  readonly winner?: Player;
}
```

### 3. Narrow with exhaustive `switch`

The discriminator lets TypeScript narrow inside a `switch`. End the switch
with an `assertNever` so adding a new variant later forces every caller to
handle it.

```ts
function statusBanner(state: GameState): string {
  switch (state.outcome.status) {
    case "ongoing": return `Tura: ${state.currentPlayer}`;
    case "win":     return `Wygrał: ${state.outcome.winner}`;
    case "draw":    return "Remis";
    default: {
      const _exhaustive: never = state.outcome;
      throw new Error(`Unhandled outcome: ${JSON.stringify(_exhaustive)}`);
    }
  }
}
```

### 4. Use generics to parameterize, not to vary

When the engine should not know game-specific shapes (ADR 0001), expose
generics with sensible defaults. Backend and Frontend can ignore the
generics when they don't need them; per-game code fills them in.

```ts
export interface GameDefinition<
  TKind extends string = string,
  TMove extends Move = Move,
> {
  readonly id: string;
  readonly validateMove: (state: GameState<TKind, TMove>, move: TMove) => string | null;
  // …
}
```

### 5. Brand IDs when crossing the network

Plain `string` IDs let you accidentally pass a `matchId` where a `gameId`
is expected. Brand types catch that at compile time without runtime cost.
Use sparingly — branding everything makes the code noisy.

```ts
type MatchId = string & { readonly __brand: "MatchId" };

function asMatchId(raw: string): MatchId {
  if (!/^[a-zA-Z0-9_-]{1,64}$/.test(raw)) {
    throw new Error(`Invalid matchId: ${raw}`);
  }
  return raw as MatchId;
}
```

### 6. Version your persisted shapes

Anything that lands on disk or on the wire deserves a literal
`schemaVersion: 1` field. The validator on read can reject anything that
isn't `1` until you write a migration. See
[`file-io-safety.md`](./file-io-safety.md).

## Code example

The full contract for this repo is at
[`packages/engine/src/types.ts`](../packages/engine/src/types.ts):

- `GameState<TKind, TMove>` — readonly throughout, parameterized.
- `Outcome` — three-arm discriminated union.
- `MoveResult<TKind, TMove>` — `{ ok: true; state }` vs
  `{ ok: false; error: MoveError }`.
- `MoveError` — three-arm discriminator on `code`.

## Anti-patterns

- **`any` or `unknown` at module boundaries** — at the boundary is exactly
  where types pay off. `unknown` is fine inside a narrowing fence; `any`
  is rarely fine.
- **Mutable arrays/objects in exported types** — invites action-at-a-
  distance bugs. Always `ReadonlyArray<T>` and `readonly` fields.
- **Optional fields with hidden dependencies** — replace with a
  discriminated union; see `Outcome` above.
- **Switch without `default: never` assertion** — adding a variant later
  fails silently. Always assert.
- **Branding everything** — brand only at boundaries where confusion is
  likely; otherwise the noise outweighs the safety.
