# Krok 2 — Postęp dostarczenia warsztatu

> Migawka stanu z dysku. Plan ([`01-action-plan.md`](./01-action-plan.md)) jest umową, ten plik mówi, gdzie naprawdę jesteśmy. Tracker odświeża workshop-producer na koniec każdego sprintu (krok 6 operating loopu).

**Status:** 10 z 10 iteracji domkniętych (~100% pracy). **Warsztat gotowy do prezentowania.**
**Aktywna iteracja:** — (plan zamknięty).
**Ostatnia aktualizacja:** 2026-05-27 (sprint Polish: README, sanity check uruchamialności + buildu, acceptance criteria z sekcji 10 promptu).

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
| 9  | Skille + przewodnik             | DONE   | `skills/README.md` + 6 skilli; `workshop/facilitator-notes.md` (PL, minutowy timing 90 min); wszystkie `*(planned)*` markery zniknęły z agentów |
| 10 | Polish pass                     | DONE   | `README.md` (EN, quick start + repo tour + linki do prezentacji/planu/ADR-ów/agentów/skilli); `npm run build` produkcyjny przechodzi (6 routes, 103 kB shared); typecheck 4 paczek zielony; smoke test API potwierdza 2 gry |

## Acceptance criteria (sekcja 10 promptu inicjującego)

Z [`00-bootstrap-prompt.md`](./00-bootstrap-prompt.md) sekcja 10:

- [x] `git clone && npm install && npm run dev` → `http://localhost:3000` pokazuje działającą aplikację — *zweryfikowane 2026-05-27, dev server Ready in 11.6s, smoke test API `/api/games` zwraca dwie gry.*
- [x] Uruchamia się tic-tac-toe **i** warcaby, wybierane bez modyfikacji kodu silnika — *Iter 6 + Iter 7 zamknięte. Bramka `git diff` na `packages/engine/` przy dodaniu checkers = 0 linii.*
- [x] Plik stanu gry powstaje w `data/matches/` i jest czytelny dla człowieka — *Iter 6 smoke test: `data/matches/tic-tac-toe-<id>.json`, `data/matches/checkers-<id>.json` z `schemaVersion: 1`, JSON 2-space pretty-printed.*
- [x] `presentation/index.html` otwarty z dysku w przeglądarce działa offline (brak żądań sieciowych) — *Iter 8 grep `https?://|src="//|@import url|url("https:` = 0 trafień.*
- [x] W `agents/` są cztery role, każda z jasno wyznaczonymi granicami; orchestrator jest jedynym, który adresuje człowieka — *Iter 4. Plus piąty plik `workshop-producer.md` jako meta-agent dostarczania (D13 w planie), świadomie poza systemem curriculum.*
- [x] `skills/` zawiera co najmniej 3 skille i README wyjaśniający różnicę skill vs agent — *Iter 9: 6 skilli + README, każda referencja z `agents/*.md` rezolwuje do realnego pliku.*
- [x] `docs/architecture/` zawiera co najmniej 2 ADR-y opisujące najważniejsze decyzje — *Iter 5: ADR 0001 (engine-vs-game split) + ADR 0002 (GameDefinition contract).*
- [x] Kod, komentarze, identyfikatory i README projektu są po angielsku; prezentacja i plan po polsku — *Iter 10 weryfikacja. Wyjątek `displayName` w grach (PL, bo UI-facing) — zgodne z bootstrap sekcja 7.*
- [x] Repo nie zawiera kluczy, sekretów ani zależności od płatnych usług — *Verified across every sprint: brak `.env*`, brak kluczy, brak płatnych deps; jedyne deps to Next.js + React + Tailwind + TypeScript.*

**Wszystkie 9 kryteriów spełnione. Plan zamknięty.**

## Otwarte ryzyka wychwycone przy re-readzie

Brak otwartych ryzyk strukturalnych. Trzy wcześniej zidentyfikowane zostały domknięte w sprincie reflektywnym 2026-05-26:

- ~~**Broken skill references**~~ — rozwiązane: wszystkie referencje do nieistniejących skilli w `agents/*.md` są oznaczone `*(planned)*`; bramka walidacji workshop-producera (krok 5) wyłącza te referencje z check'a do iteracji 9.
- ~~**Iter 8 ↔ iter 6/7 dependency**~~ — rozwiązane: zadeklarowana wprost w opisie iteracji 8 w [`01-action-plan.md`](./01-action-plan.md).
- ~~**Meta-agent w `agents/`**~~ — rozwiązane: `agents/workshop-producer.md` ujęty jawnie w planie (uwaga w iter 4 + decyzja D13 wyjaśniająca, czemu meta-agent dostarczania żyje obok czterech ról curriculum).
