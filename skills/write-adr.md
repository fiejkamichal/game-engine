# write-adr

An **Architecture Decision Record** documents one decision: what was
chosen, what was rejected, and why. Skill for the Architect (and for any
agent making a non-trivial architectural call).

## When to use

- A decision affects more than one module or specialist.
- Reasonable people would pick differently and the trade-off is
  non-obvious.
- The decision constrains future work (e.g. "engine never imports a
  specific game").
- The decision was already taken implicitly and you can feel a
  contradiction brewing — write the ADR before the contradiction lands.

If the decision is reversible in one commit by one person, skip the ADR.
Comments and a Conventional Commit body are enough.

## Procedure

### Numbering and location

- Files live in `docs/architecture/`.
- Filenames: `NNNN-<slug>.md` — 4 digits, monotonic, never reuse a number
  (even for a rejected ADR; mark it Rejected/Superseded instead).
- Slug is kebab-case, ≤ 6 words, describes the decision (not the
  alternative): `0001-engine-vs-game-split.md`, not
  `0001-should-we-share-engine.md`.

### Template

```
# ADR NNNN — <one-line decision title>

## Status

Accepted — YYYY-MM-DD.   (or Proposed / Rejected / Superseded by ADR XXXX)

## Context

What is the situation that forced the decision? Include constraints,
goals, and the relevant prior ADRs / sections of the bootstrap prompt or
action plan. Keep it factual — no "we believe", "we think".

## Decision

What was decided. State it as a single declarative paragraph, then list
the concrete commitments (interfaces named, files created, rules enforced).
The reader should not have to guess what changes.

## Alternatives considered

For each rejected alternative:

### Alt X — <name>

Single sentence of what the alternative was.

Rejected because:

- bullet — concrete reason rooted in this repo's constraints.
- bullet — another concrete reason.

Three to five alternatives is plenty. Two is suspicious. One looks like
you only wrote down the option you were already attached to.

## Consequences

### Positive

What follow-through becomes easy or verifiable. Quote the gate where
possible ("Adding a third game touches zero files under
`packages/engine/` — checked by diff in iteration 7").

### Negative

What is now harder or impossible. An ADR with no negative consequences is
either trivial or dishonest.

## References

- Prior ADRs this one builds on.
- Source files that implement the decision.
- Plan or bootstrap sections that drove it.
```

### Tone

- Factual, ego-free. "X is rejected because Y", not "X is wrong".
- Past tense for the context, present tense for the decision.
- Write for the next person reading the repo cold in three months.
- No emoji.

## Code example

The first two ADRs of this repo:

- [`docs/architecture/0001-engine-vs-game-split.md`](../docs/architecture/0001-engine-vs-game-split.md)
  — engine knows only structural facts; games own all semantic rules.
  Four rejected alternatives (no shared engine, gameKind switch,
  rule-script DSL, class-based inheritance) each with explicit reasons.
- [`docs/architecture/0002-game-definition-contract.md`](../docs/architecture/0002-game-definition-contract.md)
  — the `GameDefinition` shape, the move-flow protocol, the file format
  under `data/`. Includes a mermaid diagram of the six-step flow.

## Anti-patterns

- **No alternatives section** — the ADR records only the winner; future
  readers cannot tell whether you considered their suggestion.
- **`Consequences: positive` only** — see "negative" above. Even good
  decisions cost something.
- **ADR that contradicts a prior ADR without superseding it** — open with
  `Status: Supersedes ADR XXXX` and add a line at the bottom of the older
  one.
- **One-line "we decided X"** — that is a Conventional Commit body, not an
  ADR. ADR justifies; commit announces.
- **ADR for a reversible cosmetic choice** — wastes the reader's time. Use
  for decisions you don't want to litigate every quarter.
