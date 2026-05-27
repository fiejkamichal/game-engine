# react-board-rendering

Skill for the Frontend Developer. Render a square-grid game board from a
`GameState`, delegate clicks to a single handler, keep the UI accessible
without branching on the game id.

## When to use

- You are rendering any 2D board (tic-tac-toe, checkers, future games).
- The board dimensions come from data (`GameDefinition.boardSize`), not
  from a hard-coded constant.
- The interaction model is "user clicks one or more cells, the move is
  built from those clicks" — see `apps/web/lib/games-ui.ts` for how a
  game declares its click protocol.

## Procedure

### 1. Build the grid with dynamic columns

Tailwind cannot generate class names like `grid-cols-8` at runtime, but
inline `style` works for any column count, including 3 (tic-tac-toe) and
8 (checkers):

```tsx
const cols = state.board[0]?.length ?? 1;

<div
  className="grid gap-1 rounded-lg border bg-neutral-950 p-2"
  style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
  role="grid"
>
  {/* … cells … */}
</div>
```

`minmax(0, 1fr)` lets cells shrink below their content size — important
when the board is bigger than the viewport.

### 2. One button per cell; closure passes `(row, col)`

Buttons get keyboard focus, screen-reader semantics, and disabled-state
visuals for free. Don't reach for `<div onClick>` — `tab` will not find
it.

```tsx
{state.board.map((row, rowIdx) =>
  row.map((cell, colIdx) => (
    <button
      key={`${rowIdx}-${colIdx}`}
      type="button"
      role="gridcell"
      onClick={() => onCellClick(rowIdx, colIdx)}
      disabled={finished || busy}
      className={cellClass(rowIdx, colIdx, cell, selected)}
      aria-label={cellLabel(rowIdx, colIdx, cell, selected)}
    >
      {pieceLabel(cell)}
    </button>
  )),
)}
```

### 3. Delegate visuals to per-game UI helpers

Game-specific concerns (different pieces, dark-vs-light squares, max
selection length) live in
[`apps/web/lib/games-ui.ts`](../apps/web/lib/games-ui.ts), not in the
board component. The board asks the helper for a `renderPiece(piece)`
and a `boardCellClass(cell)` and otherwise does nothing game-aware.

```tsx
const ui = getGameUi(state.gameId);

const baseCellClass = ui.boardCellClass({ row: rowIdx, col: colIdx });
const pieceRender = cell !== null ? ui.renderPiece(cell) : null;
```

This is the rule "the UI does not branch on `gameId`" made structural:
the only branch is the lookup inside `getGameUi`, and everything
downstream is uniform.

### 4. Multi-click flow via `selectedCells`

Some games need two clicks (source → target). Keep the accumulated
selection in component state and ask the game's `buildMove` what to do
on each click:

```tsx
function onCellClick(row: number, col: number) {
  if (busy || state.outcome.status !== "ongoing") return;
  const cell = { row, col };
  const nextSelection = [...selectedCells, cell];
  const result = ui.buildMove(state, nextSelection);

  if (result.status === "ready") {
    setSelectedCells([]);
    void sendMove(result.move);
  } else if (result.status === "need-more") {
    setSelectedCells(nextSelection);
  } else {
    setSelectedCells([]);
    setError(result.error);
  }
}
```

`isSelected(row, col)` then drives the selection ring class. Reset
selection on every successful submit and every reset error.

### 5. A11y essentials

- `role="grid"` on the container, `role="gridcell"` on each button.
- `aria-label` per cell with row + col + occupancy state — screen
  readers depend on this.
- `aria-live="polite"` on the status banner so wins / draws are
  announced.
- Disabled state on buttons (`disabled={…}`) when the match is decided
  or a request is in flight, so keyboard users don't fire ghosts.

### 6. Scale cell size to the board

```tsx
const cellSize = cols <= 4 ? "h-20 w-20 text-3xl" : "h-12 w-12 text-xl";
```

Pick a few breakpoints and switch on the column count; an 8×8 board at
80×80 px does not fit on a laptop screen, a 3×3 at 48×48 px looks
cramped.

## Code example

The full board lives in
[`apps/web/app/match/[id]/match-board.tsx`](../apps/web/app/match/%5Bid%5D/match-board.tsx).
It works for both tic-tac-toe and checkers from the same component
tree, parameterized only by the current `GameState` and the helper
returned by `getGameUi(state.gameId)`.

## Anti-patterns

- **`<div onClick={…}>` for cells** — no focus, no keyboard, no
  disabled state. Use `<button type="button">`.
- **`if (state.gameId === "tic-tac-toe") …`** inside the board — every
  game-specific concern belongs in `games-ui.ts`. The grep `gameId ===`
  in `match-board.tsx` returning zero hits is a structural invariant.
- **Hard-coded grid class like `grid-cols-3`** — works for one game,
  fails for the second. Use the inline `gridTemplateColumns` pattern.
- **No `disabled` on cells after the match ends** — players keep
  clicking, server keeps replying 409. Cheap to fix at the UI.
- **Skipping `aria-label`** — visually fine, ships with no screen
  reader story.
