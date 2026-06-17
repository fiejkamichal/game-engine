# game-engine

A turn-based game engine and two reference games (tic-tac-toe and minimal
checkers), built as a teaching deliverable for the workshop
**"AI Generation w praktyce: Od teorii do zastosowania"** (90 minutes,
Polish). One engine, two games, four agent roles, one runnable codebase.

## Quick start

No paid APIs, no database, no external services.

### Prerequisites

You need four things installed. One-line install hints for Windows
(`winget`) and Linux (`apt`/`nvm`) below; verify each with the version
command.

| Tool | Why | Windows | Linux | Verify |
|---|---|---|---|---|
| **Node.js LTS ≥ 20** (ships with **npm ≥ 10**) | Runs the app and installs deps | `winget install OpenJS.NodeJS.LTS` | `nvm install --lts` (or `sudo apt install nodejs npm`) | `node --version`, `npm --version` |
| **Git** | Clone the repo | `winget install Git.Git` | `sudo apt install git` | `git --version` |
| **Editor** | Edit code, integrated terminal | Cursor (<https://cursor.com>) or VS Code (<https://code.visualstudio.com>) | same | open it |
| **AI copilot account** (optional) | Vibe coding in the workshop | Cursor built-in / GitHub Copilot / free browser chat | same | log in |

Never installed these before? See
[`workshop/installation-guide.md`](workshop/installation-guide.md) for a
full from-zero walkthrough (Windows + Linux, with troubleshooting).

### Clone and run

```bash
git clone <this-repo>
cd game-engine
npm install
npm run dev
```

Open <http://localhost:3000> — pick a game, click **Nowy mecz**, play. Match
state lands in `data/matches/{matchId}.json`; the file is plain JSON and
human-readable.

To view the slide deck offline, open `presentation/index.html` by
double-clicking it in any browser. The deck makes zero network requests.

## What is in this repo

```
apps/web/                Next.js 15 app — UI, API routes, file I/O.
packages/engine/         Game-agnostic engine: types + runtime.
packages/games/
  ├ tic-tac-toe/         GameDefinition for 3×3 tic-tac-toe.
  └ checkers/            GameDefinition for minimal 8×8 checkers.
data/matches/            Match-state files (JSON), one per match.
presentation/            Standalone HTML deck (Polish, offline).
agents/                  Four specialist roles + one delivery meta-agent.
skills/                  Procedural know-how that agents apply.
docs/architecture/       Architecture Decision Records.
workshop/                Plan, progress tracker, facilitator notes.
```

## Where to go next

- **Run the workshop:** [`workshop/facilitator-notes.md`](workshop/facilitator-notes.md)
  — minute-by-minute schedule, vibe-coding tasks, fallback scripts.
- **Understand the architecture:**
  [`docs/architecture/0001-engine-vs-game-split.md`](docs/architecture/0001-engine-vs-game-split.md)
  (why) →
  [`docs/architecture/0002-game-definition-contract.md`](docs/architecture/0002-game-definition-contract.md)
  (how).
- **Read the type contract:**
  [`packages/engine/src/types.ts`](packages/engine/src/types.ts) —
  `GameDefinition`, `GameState`, `Move`, `Outcome`.
- **See an agent role file:**
  [`agents/orchestrator.md`](agents/orchestrator.md) (sole human-facing
  agent), then the other four under `agents/`.
- **See a skill file:**
  [`skills/commit-message.md`](skills/commit-message.md) and
  [`skills/README.md`](skills/README.md) (skill vs agent).
- **Track delivery state:**
  [`workshop/plan/02-progress.md`](workshop/plan/02-progress.md) — which
  iteration of the 10-step plan is active, with file-path evidence.

## Architectural punchline

The engine knows two players, turns, a square board, pieces with an owner
and a kind, and how to persist a `GameState` to disk. It knows nothing
about move legality or win conditions.

Each game implements a tiny contract (`GameDefinition` — four methods,
three readonly fields) and lives under `packages/games/<game>/`.

The dependency arrow is one-way: games depend on
`@game-engine/engine`, never the other way. Adding a third game requires
zero edits under `packages/engine/`. The gate is verifiable:

```bash
git diff <commit-before-the-new-game>..HEAD -- packages/engine/
# (empty)
```

See [ADR 0001](docs/architecture/0001-engine-vs-game-split.md) for the
rationale and [ADR 0002](docs/architecture/0002-game-definition-contract.md)
for the contract.

## Language conventions

- **English:** code, comments, identifiers, agent definitions, skills,
  ADRs, this README. These are code-adjacent artifacts.
- **Polish:** the slide deck (`presentation/index.html`), the workshop
  plan (`workshop/plan/`), and the facilitator notes
  (`workshop/facilitator-notes.md`). These are workshop materials.
- Game `displayName` fields are Polish because they reach the UI.

See `workshop/plan/00-bootstrap-prompt.md` section 7 for the original
rule.

## Multi-agent architecture

Four specialist roles drive the codebase, plus one meta-agent for
delivering the workshop itself:

| Agent | Owns | Talks to human? |
|---|---|---|
| [Orchestrator](agents/orchestrator.md) | Translates intent into tasks; sequences specialists. | **Yes — sole interface.** |
| [Architect](agents/architect.md) | ADRs and type contracts. | No (via Orchestrator). |
| [Backend Developer](agents/backend-developer.md) | Engine runtime, API routes, file persistence. | No. |
| [Frontend Developer](agents/frontend-developer.md) | React components, board, click handling. | No. |
| [Workshop Producer](agents/workshop-producer.md) | Pushes the action plan by one increment per invocation. *Meta-agent — not part of the in-workshop curriculum.* | Yes, in its own producer role. |

The boundary lines between agents are recorded in each agent's file
under `Boundaries`. The skills they apply are in `skills/`.

## Scripts

| Command | Effect |
|---|---|
| `npm run dev` | Start Next.js dev server on `http://localhost:3000`. |
| `npm run build` | Production build. |
| `npm run start` | Run the built production server. |
| `npm run typecheck --workspace=@game-engine/engine` | Typecheck the engine package. |
| `npm run typecheck --workspace=@game-engine/tic-tac-toe` | Typecheck tic-tac-toe. |
| `npm run typecheck --workspace=@game-engine/checkers` | Typecheck checkers. |

## Status

This repository is a finished workshop deliverable, not a production
codebase. Match state is plain JSON on disk; there is no auth, no
networking between players, and no persistence outside the local
filesystem. The hot-seat (two players, one screen) model is a deliberate
scope choice — see decision D6 in
[`workshop/plan/01-action-plan.md`](workshop/plan/01-action-plan.md).
