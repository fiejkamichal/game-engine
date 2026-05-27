# Skills

A **skill** is a piece of procedural know-how — "how to do X correctly here"
— that any agent can read and apply. Skills are reusable, format-stable,
and have no autonomy of their own.

## Skill vs agent

| | **Skill** | **Agent** |
|---|---|---|
| What it is | Procedural instruction. | Decision-making unit with a role and goal. |
| Has a goal? | No — it answers "how do I do X?" | Yes — it pursues an outcome. |
| Has autonomy? | No. | Yes, within its boundaries. |
| Uses other artifacts? | No. | Yes — agents use skills, ADRs, type contracts. |
| Example | "Use atomic writes for JSON state files." | "Architect: define type contracts and ADRs." |

In this repo, skills live in `skills/`, agents in `agents/`. Every agent
file's `Tools / Skills` section names the skills the agent is expected to
apply. When a skill reference points to a file that does not yet exist, the
agent flags it as `*(planned)*` to keep the workshop-producer's validation
gates honest.

## Skill file shape

Each skill is a short markdown file. Use these section headings; fill the
ones that apply, drop the rest:

```
# <Skill title>

## When to use

One paragraph: what trigger or scenario calls for this skill.

## Procedure

Step-by-step or rules-of-thumb. Keep it operational, not philosophical.

## Code example

A real fragment from this repo, with a path reference.

## Anti-patterns

Common mistakes and why they hurt — usually one or two bullets.
```

Skills are written in **English** (they are code-adjacent artifacts; see
section 7 of `workshop/plan/00-bootstrap-prompt.md`). The single Polish
exception under `workshop/` is the facilitator notes, which are workshop
materials for the human running the session.

## What is here right now

| File | Used by | Topic |
|---|---|---|
| [`commit-message.md`](./commit-message.md) | every agent | Conventional Commits format. |
| [`write-task-brief.md`](./write-task-brief.md) | orchestrator, workshop-producer | Template for handing work to a specialist. |
| [`define-typescript-contract.md`](./define-typescript-contract.md) | architect, backend-developer, frontend-developer | Discriminated unions, exhaustive switches, readonly defaults. |
| [`write-adr.md`](./write-adr.md) | architect | ADR template + numbering rules. |
| [`file-io-safety.md`](./file-io-safety.md) | backend-developer | Atomic JSON writes; safe match-id handling. |
| [`react-board-rendering.md`](./react-board-rendering.md) | frontend-developer | Square-grid rendering, click delegation, a11y. |

Adding a new skill is one new file plus a row above. Adding a new
*reference* to a skill from an agent is a one-line edit in that agent's
`Tools / Skills` section.
