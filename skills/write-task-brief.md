# write-task-brief

A **task brief** is the structured handoff the Orchestrator (or the
workshop-producer, via the Orchestrator) gives a specialist agent before
it starts work. Briefs prevent ambiguous goals, contract drift, and "I
thought you meant…" rework.

## When to use

- The Orchestrator translates a human request that spans more than one
  specialist's scope.
- The workshop-producer recognises that the current increment falls
  inside Architect / Backend / Frontend territory and is delegating.
- Any agent is about to ask another agent for work.

## Procedure

Write the brief as a short markdown block (or message body) with **every**
of these fields filled. Skip none. Brevity is fine; ambiguity is not.

```
Scope:           One sentence — what the specialist owns this round.
Target files:    Paths or globs the work will land in. Anchor in the
                 specialist's scope (`packages/engine/`, `apps/web/`, …).
Expected artifact: What exists at the end. "A commit", "an ADR file",
                 "a typed API route", …
Definition of done:
  - bullet 1 — verifiable
  - bullet 2 — verifiable
  - …
Links / context:  ADR numbers, type-contract files, prior task briefs,
                 relevant skill files.
Constraints:     What must NOT change. e.g. "do not touch
                 `packages/engine/`", "no new dependencies".
Out of scope:    Items intentionally deferred to a later brief.
```

Bracket the brief between fenced blocks (e.g. ```` ```brief ```` … ```` ``` ````)
when delivering it inside a longer message so the specialist can extract it.

## Code example

A historically faithful brief that would have produced
[`docs/architecture/0001-engine-vs-game-split.md`](../docs/architecture/0001-engine-vs-game-split.md):

```
Scope:           Settle the engine-vs-game split before any runtime code
                 ships.
Target files:    docs/architecture/0001-engine-vs-game-split.md (new),
                 docs/architecture/0002-game-definition-contract.md
                 (new), packages/engine/src/types.ts (new).
Expected artifact:
                 Two ADRs and a compiling `types.ts` re-exported from
                 `packages/engine/src/index.ts`.
Definition of done:
  - Each ADR has Status, Context, Decision, Alternatives, Consequences.
  - `GameDefinition`, `GameState`, `Move`, `Outcome`, `MoveResult`,
    `MoveError` exist and `tsc --noEmit` is green under strict.
  - `packages/engine/src/index.ts` re-exports the types.
  - Backend and Frontend can start work against this contract without a
    follow-up question (Architect's done criterion #3).
Links / context:
  - skills/write-adr.md
  - skills/define-typescript-contract.md
  - workshop/plan/00-bootstrap-prompt.md section 4.3
  - workshop/plan/01-action-plan.md iteration 5
Constraints:     No runtime code yet (saved for iteration 6). No
                 dependency on a specific game.
Out of scope:    Engine runtime (`applyMove`, `getOutcome`, …) — those
                 ship in iteration 6.
```

## Anti-patterns

- **"Make it nicer"** — un-actionable. Replace with a verifiable DoD.
- **Missing target files** — forces the specialist to guess where work
  lands; usually they guess in a place that breaks scope.
- **No "out of scope" line** — invites scope creep. Even an empty
  "Out of scope: nothing this round" is healthier than silence.
- **Brief that contradicts an ADR** — the ADR wins. Update the brief, or
  open a new ADR first.
- **Brief without a DoD checklist** — the specialist cannot self-verify
  before handing back. Reviewer ends up checking the entire diff.
