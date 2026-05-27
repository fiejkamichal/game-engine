# commit-message

Use the [Conventional Commits](https://www.conventionalcommits.org)
convention for every commit in this repo. Shared by every agent; the
workshop-producer's "Ship" step in particular validates that the message
follows this skill before pushing.

## When to use

Every time you stage changes and write a commit message. This skill governs
both the subject line and the body, not just the type prefix.

## Procedure

### Subject line

```
<type>(<scope>): <subject>
```

- **type** — one of:
  - `feat` — a new capability the user or another agent can observe.
  - `fix` — bug fix.
  - `refactor` — internal change with no observable behavior delta.
  - `docs` — documentation, ADRs, plan, skills, comments. No code logic.
  - `chore` — repo plumbing (package.json, lockfiles, ignores).
  - `test` — adding or fixing tests.
  - `perf` — performance change with measurable impact.
  - `build`, `ci`, `style`, `revert` — use when literally that.
- **scope** — optional. For this repo, prefer one of:
  - the iteration: `iter6`, `iter7`, …
  - the package: `engine`, `tic-tac-toe`, `checkers`, `web`
  - leave it off entirely for cross-cutting docs / tracker work.
- **subject** — imperative mood (`add`, not `added`/`adds`), lowercase
  first letter, no trailing period, ≤ 72 characters.

### Body

- One blank line after the subject.
- Explain **why**, not what. The diff already shows what.
- Wrap at ~72 columns.
- Use bullet groups (` - …`) to list concrete deliverables when several
  files moved together.
- Optionally end with a short validation paragraph: which gates passed
  (`tsc --noEmit`, `npm run dev`, smoke test) so a reviewer can re-run
  them.

### Footer

- Breaking changes: a paragraph starting with `BREAKING CHANGE:`.
- Cross-references: `Refs: #123`, `Closes: #456`.
- Co-authors only when actually co-authored, with the exact GitHub format.

## Code example

A real commit from this repo (`git log --pretty=full -1 cf9cd8b`):

```
feat(iter6): engine runtime + tic-tac-toe + API + UI end-to-end

Close iteration 6 of the action plan. Player can now open the app at
http://localhost:3000, start a tic-tac-toe match, click cells to play,
and watch the match resolve to a win or a draw — all backed by atomic
JSON writes under data/matches/.

Engine runtime (packages/engine/src/engine.ts)
- applyMove implements the six-step protocol from ADR 0002.
- Engine owns currentPlayer toggling; the game's applyMove may leave
  currentPlayer to anything.

[…]

Validation
- npm install: 51 packages, two workspace packages registered.
- typecheck @game-engine/engine: zero errors.
- next dev: Ready in 18.6s on http://localhost:3000.
```

Note: type is `feat` (new capability), scope is the iteration (`iter6`),
subject is in imperative mood, body explains the *why*, validation
paragraph at the end.

## Anti-patterns

- **`Update files`**, **`Fix stuff`**, **`Changes`** — opaque. The diff
  already shows what was updated; the message must explain why.
- **Past tense** (`fixed bug`, `added feature`) — use imperative.
- **Trailing period in the subject** — drop it.
- **Multiple unrelated changes in one commit** — split. One commit = one
  reviewable unit.
- **`feat:` for a docs-only change** — use `docs:`. Type accuracy keeps the
  changelog readable.
- **Body that paraphrases the diff** — write the *intent*, not the lines.
