# Krok 2 — Postęp dostarczenia warsztatu

> Migawka stanu z dysku. Plan ([`01-action-plan.md`](./01-action-plan.md)) jest umową, ten plik mówi, gdzie naprawdę jesteśmy. Tracker odświeża workshop-producer na koniec każdego sprintu (krok 6 operating loopu).

**Status:** 8 z 10 iteracji domkniętych (~80% pracy za nami).
**Aktywna iteracja:** Iter 9 — Skille + przewodnik prowadzącego.
**Ostatnia aktualizacja:** 2026-05-27 (sprint prezentacyjny: dwa nowe slajdy z cytatami kodu, 11 → 13 slajdów).

| #  | Iteracja                        | Status | Dowód / blocker                                                                                 |
|----|---------------------------------|--------|-------------------------------------------------------------------------------------------------|
| 1  | Plan                            | DONE   | `workshop/plan/01-action-plan.md` — 10 iteracji z DoD, D1–D13, ryzyka                           |
| 2  | Szkielet Next.js                | DONE   | `apps/web/` (Next.js 15 + React 19 + Tailwind v4), `npm run dev` startuje                       |
| 3  | Draft prezentacji               | DONE   | `presentation/index.html` — 11 slajdów, inline CSS+JS, offline                                  |
| 4  | Agenci                          | DONE   | `agents/{orchestrator,architect,backend-developer,frontend-developer}.md` + meta `workshop-producer.md` |
| 5  | ADR-y + kontrakty typów         | DONE   | `docs/architecture/{0001-engine-vs-game-split,0002-game-definition-contract}.md` + `packages/engine/src/{types,index}.ts` |
| 6  | Engine + tic-tac-toe end-to-end | DONE   | `packages/engine/src/engine.ts` runtime, `packages/games/tic-tac-toe/`, API routes, UI          |
| 7  | Checkers                        | DONE   | `packages/games/checkers/`, `apps/web/lib/games-ui.ts`, `git diff HEAD -- packages/engine/` = puste |
| 8  | Domknięcie prezentacji          | DONE   | 13 slajdów w `presentation/index.html`, dwa nowe slajdy ("Kontrakt", "Druga gra") cytują `packages/engine/src/types.ts`, `packages/games/tic-tac-toe/src/index.ts`, `packages/games/checkers/src/index.ts`; grep `https?://` w pliku = 0 trafień (zero-network potwierdzone) |
| 9  | Skille + przewodnik             | ACTIVE | `skills/` puste, brak `workshop/facilitator-notes.md`                                           |
| 10 | Polish pass                     | TODO   | `README.md` ma jedną linię, brak sanity-checku na czystej maszynie                              |

## Otwarte ryzyka wychwycone przy re-readzie

Brak otwartych ryzyk strukturalnych. Trzy wcześniej zidentyfikowane zostały domknięte w sprincie reflektywnym 2026-05-26:

- ~~**Broken skill references**~~ — rozwiązane: wszystkie referencje do nieistniejących skilli w `agents/*.md` są oznaczone `*(planned)*`; bramka walidacji workshop-producera (krok 5) wyłącza te referencje z check'a do iteracji 9.
- ~~**Iter 8 ↔ iter 6/7 dependency**~~ — rozwiązane: zadeklarowana wprost w opisie iteracji 8 w [`01-action-plan.md`](./01-action-plan.md).
- ~~**Meta-agent w `agents/`**~~ — rozwiązane: `agents/workshop-producer.md` ujęty jawnie w planie (uwaga w iter 4 + decyzja D13 wyjaśniająca, czemu meta-agent dostarczania żyje obok czterech ról curriculum).
