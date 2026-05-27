# Krok 2 — Postęp dostarczenia warsztatu

> Migawka stanu z dysku. Plan ([`01-action-plan.md`](./01-action-plan.md)) jest umową, ten plik mówi, gdzie naprawdę jesteśmy. Tracker odświeża workshop-producer na koniec każdego sprintu (krok 6 operating loopu).

**Status:** 9 z 10 iteracji domkniętych (~90% pracy za nami).
**Aktywna iteracja:** Iter 10 — Polish pass (końcowy).
**Ostatnia aktualizacja:** 2026-05-27 (sprint skilli + przewodnika: 7 plików w `skills/`, facilitator-notes po polsku, znikły wszystkie `*(planned)*` markery z agentów).

| #  | Iteracja                        | Status | Dowód / blocker                                                                                 |
|----|---------------------------------|--------|-------------------------------------------------------------------------------------------------|
| 1  | Plan                            | DONE   | `workshop/plan/01-action-plan.md` — 10 iteracji z DoD, D1–D13, ryzyka                           |
| 2  | Szkielet Next.js                | DONE   | `apps/web/` (Next.js 15 + React 19 + Tailwind v4), `npm run dev` startuje                       |
| 3  | Draft prezentacji               | DONE   | `presentation/index.html` — 13 slajdów, inline CSS+JS, offline                                  |
| 4  | Agenci                          | DONE   | `agents/{orchestrator,architect,backend-developer,frontend-developer}.md` + meta `workshop-producer.md` |
| 5  | ADR-y + kontrakty typów         | DONE   | `docs/architecture/{0001-engine-vs-game-split,0002-game-definition-contract}.md` + `packages/engine/src/{types,index}.ts` |
| 6  | Engine + tic-tac-toe end-to-end | DONE   | `packages/engine/src/engine.ts` runtime, `packages/games/tic-tac-toe/`, API routes, UI          |
| 7  | Checkers                        | DONE   | `packages/games/checkers/`, `apps/web/lib/games-ui.ts`, `git diff HEAD -- packages/engine/` = puste |
| 8  | Domknięcie prezentacji          | DONE   | 13 slajdów, dwa nowe slajdy cytują `packages/engine/src/types.ts`, `packages/games/{tic-tac-toe,checkers}/src/index.ts`; zero-network potwierdzone |
| 9  | Skille + przewodnik             | DONE   | `skills/README.md` + 6 skilli (`commit-message`, `write-task-brief`, `define-typescript-contract`, `write-adr`, `file-io-safety`, `react-board-rendering`); `workshop/facilitator-notes.md` (PL, minutowy timing 90 min + fallbacki + lista zadań); wszystkie `*(planned)*` markery zniknęły z agentów |
| 10 | Polish pass                     | ACTIVE | `README.md` ma jedną linię, brak sanity-checku na czystej maszynie, brak instrukcji startu                              |

## Otwarte ryzyka wychwycone przy re-readzie

Brak otwartych ryzyk strukturalnych. Trzy wcześniej zidentyfikowane zostały domknięte w sprincie reflektywnym 2026-05-26:

- ~~**Broken skill references**~~ — rozwiązane: wszystkie referencje do nieistniejących skilli w `agents/*.md` są oznaczone `*(planned)*`; bramka walidacji workshop-producera (krok 5) wyłącza te referencje z check'a do iteracji 9.
- ~~**Iter 8 ↔ iter 6/7 dependency**~~ — rozwiązane: zadeklarowana wprost w opisie iteracji 8 w [`01-action-plan.md`](./01-action-plan.md).
- ~~**Meta-agent w `agents/`**~~ — rozwiązane: `agents/workshop-producer.md` ujęty jawnie w planie (uwaga w iter 4 + decyzja D13 wyjaśniająca, czemu meta-agent dostarczania żyje obok czterech ról curriculum).
