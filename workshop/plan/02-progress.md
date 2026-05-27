# Krok 2 — Postęp dostarczenia warsztatu

> Migawka stanu z dysku. Plan ([`01-action-plan.md`](./01-action-plan.md)) jest umową, ten plik mówi, gdzie naprawdę jesteśmy. Tracker odświeża workshop-producer na koniec każdego sprintu (krok 6 operating loopu).

**Status:** 6 z 10 iteracji domkniętych (~60% pracy za nami).
**Aktywna iteracja:** Iter 7 — Checkers jako dowód oddzielenia.
**Ostatnia aktualizacja:** 2026-05-27 (sprint Backend + Frontend: domknięcie iter 6 — engine runtime + tic-tac-toe + API + UI end-to-end).

| #  | Iteracja                        | Status | Dowód / blocker                                                                                 |
|----|---------------------------------|--------|-------------------------------------------------------------------------------------------------|
| 1  | Plan                            | DONE   | `workshop/plan/01-action-plan.md` — 10 iteracji z DoD, D1–D13, ryzyka                           |
| 2  | Szkielet Next.js                | DONE   | `apps/web/` (Next.js 15 + React 19 + Tailwind v4), `npm run dev` startuje                       |
| 3  | Draft prezentacji               | DONE   | `presentation/index.html` — 11 slajdów, inline CSS+JS, offline                                  |
| 4  | Agenci                          | DONE   | `agents/{orchestrator,architect,backend-developer,frontend-developer}.md` + meta `workshop-producer.md` |
| 5  | ADR-y + kontrakty typów         | DONE   | `docs/architecture/{0001-engine-vs-game-split,0002-game-definition-contract}.md` + `packages/engine/src/{types,index}.ts` |
| 6  | Engine + tic-tac-toe end-to-end | DONE   | `packages/engine/src/engine.ts` runtime, `packages/games/tic-tac-toe/`, API routes `/api/{games,matches,matches/[id],matches/[id]/moves}`, UI `app/page.tsx` + `app/match/[id]/`, smoke test: utworzony mecz → ruch → wygrana → plik w `data/matches/` |
| 7  | Checkers                        | ACTIVE | brak `packages/games/checkers/` — celem dowód, że dodanie gry nie dotyka `packages/engine/`     |
| 8  | Domknięcie prezentacji          | TODO   | strukturalnie gotowa, ma już co cytować z iter 6 — czeka jeszcze na checkers z iter 7           |
| 9  | Skille + przewodnik             | TODO   | `skills/` puste, brak `workshop/facilitator-notes.md`                                           |
| 10 | Polish pass                     | TODO   | `README.md` ma jedną linię, brak sanity-checku na czystej maszynie                              |

## Otwarte ryzyka wychwycone przy re-readzie

Brak otwartych ryzyk strukturalnych. Trzy wcześniej zidentyfikowane zostały domknięte w sprincie reflektywnym 2026-05-26:

- ~~**Broken skill references**~~ — rozwiązane: wszystkie referencje do nieistniejących skilli w `agents/*.md` są oznaczone `*(planned)*`; bramka walidacji workshop-producera (krok 5) wyłącza te referencje z check'a do iteracji 9.
- ~~**Iter 8 ↔ iter 6/7 dependency**~~ — rozwiązane: zadeklarowana wprost w opisie iteracji 8 w [`01-action-plan.md`](./01-action-plan.md).
- ~~**Meta-agent w `agents/`**~~ — rozwiązane: `agents/workshop-producer.md` ujęty jawnie w planie (uwaga w iter 4 + decyzja D13 wyjaśniająca, czemu meta-agent dostarczania żyje obok czterech ról curriculum).
