# Krok 2 — Postęp dostarczenia warsztatu

> Migawka stanu z dysku. Plan ([`01-action-plan.md`](./01-action-plan.md)) jest umową, ten plik mówi, gdzie naprawdę jesteśmy. Tracker odświeża workshop-producer na koniec każdego sprintu (krok 6 operating loopu).

**Status:** 4 z 10 iteracji domkniętych (~33% pracy za nami).
**Aktywna iteracja:** Iter 5 — Pierwsze ADR-y i kontrakty typów.
**Ostatnia aktualizacja:** 2026-05-26 (sprint reflektywny: domknięcie trzech otwartych ryzyk).

| #  | Iteracja                        | Status | Dowód / blocker                                                                  |
|----|---------------------------------|--------|----------------------------------------------------------------------------------|
| 1  | Plan                            | DONE   | `workshop/plan/01-action-plan.md` — 10 iteracji z DoD, D1–D12, ryzyka            |
| 2  | Szkielet Next.js                | DONE   | `apps/web/` (Next.js 15 + React 19 + Tailwind v4), `npm run dev` startuje        |
| 3  | Draft prezentacji               | DONE   | `presentation/index.html` — 11 slajdów, inline CSS+JS, offline                   |
| 4  | Agenci                          | DONE   | `agents/{orchestrator,architect,backend-developer,frontend-developer}.md`        |
| 5  | ADR-y + kontrakty typów         | ACTIVE | `docs/architecture/` puste, `packages/engine/` nie istnieje                      |
| 6  | Engine + tic-tac-toe end-to-end | TODO   | brak `packages/engine/`, `packages/games/tic-tac-toe/`, API routes               |
| 7  | Checkers                        | TODO   | brak `packages/games/checkers/`                                                  |
| 8  | Domknięcie prezentacji          | TODO   | strukturalnie gotowa, czeka na konkretne przykłady kodu z iter 6/7               |
| 9  | Skille + przewodnik             | TODO   | `skills/` puste, brak `workshop/facilitator-notes.md`                            |
| 10 | Polish pass                     | TODO   | `README.md` ma jedną linię, brak sanity-checku na czystej maszynie               |

## Otwarte ryzyka wychwycone przy re-readzie

Brak otwartych ryzyk strukturalnych. Trzy wcześniej zidentyfikowane zostały domknięte w sprincie reflektywnym 2026-05-26:

- ~~**Broken skill references**~~ — rozwiązane: wszystkie referencje do nieistniejących skilli w `agents/*.md` są oznaczone `*(planned)*`; bramka walidacji workshop-producera (krok 5) wyłącza te referencje z check'a do iteracji 9.
- ~~**Iter 8 ↔ iter 6/7 dependency**~~ — rozwiązane: zadeklarowana wprost w opisie iteracji 8 w [`01-action-plan.md`](./01-action-plan.md).
- ~~**Meta-agent w `agents/`**~~ — rozwiązane: `agents/workshop-producer.md` ujęty jawnie w planie (uwaga w iter 4 + decyzja D13 wyjaśniająca, czemu meta-agent dostarczania żyje obok czterech ról curriculum).
