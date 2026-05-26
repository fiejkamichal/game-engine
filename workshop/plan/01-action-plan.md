# Krok 1 — Plan działania warsztatu

> Dokument w języku polskim — to materiał roboczy dla prowadzącego.
> Punkt odniesienia: [`00-bootstrap-prompt.md`](./00-bootstrap-prompt.md).
> Język kodu / artefaktów technicznych pozostaje **angielski**.

---

## 1. Cel nadrzędny

Dostarczyć kompletny zestaw materiałów warsztatowych „AI Generation w praktyce: Od teorii do zastosowania” (1,5 h):

- **prezentacja** w jednym pliku HTML działająca offline,
- **uruchamialne repo** (Next.js + TypeScript) z silnikiem gier turowych i dwoma referencyjnymi grami,
- **definicje czterech ról agentów** + zestaw skilli,
- **dokumentacja architektoniczna** (ADR-y, kontrakty typów),
- **plan i ściąga prowadzącego**.

Kryterium nadrzędne: po `git clone && npm install && npm run dev` działa aplikacja na `http://localhost:3000`, prezentacja otwiera się dwuklikiem, a struktura repo jest spójna z narracją prezentacji.

---

## 2. Zasady gry

1. Każdy commit musi być uruchamialny (od kroku 2 włącznie `npm run dev` startuje).
2. Mały, działający przyrost > duża niegotowa całość.
3. Każda ważna decyzja techniczna → ADR w `docs/architecture/`.
4. Język: PL w prezentacji i `workshop/`, EN w kodzie, agentach, ADR-ach, README.
5. Zero zewnętrznych płatnych API, zero kluczy w repo.

---

## 3. Iteracje (rozszerzenie sekcji 9 promptu inicjującego)

### Iteracja 1 — Plan (ten dokument)
- **Cel:** rozpisać pracę na konspekt + iteracje z explicit DoD.
- **Działania:** napisać `workshop/plan/01-action-plan.md`.
- **DoD:** dokument istnieje, każda iteracja ma DoD, decyzje wstępne i pytania otwarte są spisane.

### Iteracja 2 — Szkielet Next.js
- **Cel:** uruchamialne repo z pustą stroną.
- **Działania:**
  - root `package.json` z workspaces (`apps/*`, `packages/*`, `packages/games/*`),
  - `apps/web/` z Next.js (App Router) + TypeScript + Tailwind v4,
  - placeholder „workshop bootstrap” na `/`.
- **DoD:** `npm install && npm run dev` z roota → `http://localhost:3000` zwraca stronę bez logiki.

### Iteracja 3 — Pierwszy draft prezentacji
- **Cel:** szkielet prezentacji do iteracji.
- **Działania:** `presentation/index.html` (standalone, inline CSS + JS, brak CDN), agenda + nagłówki sekcji + 1–2 slajdy treści.
- **DoD:** otwarcie pliku z dysku w przeglądarce w trybie offline pokazuje slajdy z nawigacją (←/→), zero żądań sieciowych w DevTools → Network.

### Iteracja 4 — Pierwsze definicje agentów
- **Cel:** spisać role i granice czterech agentów.
- **Działania:** `agents/orchestrator.md`, `architect.md`, `backend-developer.md`, `frontend-developer.md`. Każdy plik: Role / Mission / Inputs / Outputs / Boundaries / Tools&Skills / Done criteria.
- **DoD:** cztery pliki MD, treść po angielsku, orchestrator jest jedynym, który adresuje człowieka, granice nie nakładają się.
- **Uwaga:** obok czterech ról specjalistycznych w `agents/` żyje też `agents/workshop-producer.md` — meta-agent dostarczania warsztatu (poza systemem wieloagentowym prezentowanym na warsztacie). Patrz D13.

### Iteracja 5 — Pierwsze ADR-y i kontrakty typów
- **Cel:** ustabilizować umowę między engine a grą zanim powstanie kod.
- **Działania:**
  - `docs/architecture/0001-engine-vs-game-split.md` — czemu engine nie zna zasad konkretnej gry.
  - `docs/architecture/0002-game-definition-contract.md` — `GameDefinition`, `GameState`, `Move`, walidacja ruchu, ogłaszanie zwycięstwa.
  - typy w `packages/engine/src/types.ts` (lub odpowiedniku).
- **DoD:** ADR-y opisują decyzję, alternatywy i konsekwencje; typy kompilują się i są re-eksportowane z paczki.

### Iteracja 6 — Engine + tic-tac-toe end-to-end
- **Cel:** najprostsza pętla rozgrywki działa.
- **Działania:**
  - `packages/engine/` — runtime: `applyMove`, `validateMove`, `getOutcome`, `createInitialState`.
  - `packages/games/tic-tac-toe/` — manifest gry + reguły jako `GameDefinition`.
  - `apps/web/api/matches/...` — odczyt/zapis pliku JSON (atomic write).
  - `apps/web/app/...` — UI: lista gier, plansza, klikalność.
- **DoD:** klik w komórkę → ruch zwalidowany przez engine → state zapisany w `data/matches/{id}.json` → UI re-renderuje. Mecz dochodzi do wygranej / remisu i zostaje to ogłoszone.

### Iteracja 7 — Checkers jako dowód oddzielenia
- **Cel:** druga gra dodana **bez zmian** w `packages/engine/`.
- **Działania:** `packages/games/checkers/` — manifest + reguły (minimalne, ale realne: ruch po skosie, bicia, damka opcjonalna).
- **DoD:** wybierane na UI bez modyfikacji engine; oba mecze równolegle utrzymują własny plik stanu; diff względem iteracji 6 nie dotyka `packages/engine/`.

### Iteracja 8 — Domknięcie prezentacji
- **Cel:** gotowa do prezentowania offline wersja.
- **Zależność:** wymaga zamknięcia iteracji 6 i 7 — „dograć przykłady z naszego repo" znaczy zacytować realny kod engine + obu gier. Bez nich iter 8 może iść co najwyżej strukturalnie.
- **Działania:** uzupełnić wszystkie sekcje treścią, dograć przykłady z naszego repo, zrobić sanity-check zero-network.
- **DoD:** wszystkie sekcje z sekcji 6 promptu obecne; otwarcie z dysku → zero żądań sieciowych; działa na Chromie i Firefoxie; co najmniej jeden slajd cytuje konkretny fragment z `packages/engine/` lub `packages/games/*/`.

### Iteracja 9 — Skille + przewodnik prowadzącego
- **Cel:** zoperacjonalizować rozróżnienie skill vs agent.
- **Działania:**
  - `skills/define-typescript-contract.md`,
  - `skills/write-adr.md`,
  - `skills/file-io-safety.md`,
  - `skills/react-board-rendering.md`,
  - `skills/commit-message.md`,
  - `skills/README.md` (czym skill jest, czym nie jest),
  - `workshop/facilitator-notes.md` — ściąga prowadzącego (PL): timing, momenty kontroli, fallbacki.
- **DoD:** ≥3 skille opisane, README skilli istnieje, ściąga ma minutowe checkpointy.

### Iteracja 10 — Polish pass
- **Cel:** repo gotowe do `git clone` przez nieznajomego.
- **Działania:** README projektu (EN) z instrukcją startu, sanity-check całości na czystej maszynie / kontenerze, zaktualizowany `workshop/plan/` (notatki z iteracji), checklist akceptacji.
- **DoD:** wszystkie kryteria z sekcji 10 promptu inicjującego (`✓` na każdej linii).

---

## 4. Decyzje wstępne (defaults, jakie podejmujemy bez pytania)

Każda z tych decyzji powinna trafić do ADR-u, kiedy będzie pierwszy raz konsumowana w kodzie. Tu trzymamy ich rejestr roboczy.

| # | Decyzja | Uzasadnienie |
|---|---|---|
| D1 | **npm workspaces** (nie pnpm/yarn) | Prompt wymaga „tylko Node LTS + npm”. |
| D2 | **Next.js 15 (App Router) + React 19 + Tailwind v4** | Aktualne stabilne wersje, prosty config (Tailwind v4 nie wymaga `tailwind.config.js`). |
| D3 | **TypeScript strict** od początku | Spójne kontrakty typów to kluczowa lekcja warsztatu. |
| D4 | **Brak ESLint/Prettier w MVP** | Mniejsza powierzchnia bootstrapu, dorzucamy dopiero kiedy okaże się potrzebny. |
| D5 | **Custom slide engine** (vanilla JS w jednym pliku) zamiast reveal.js | Lżej, bez CDN, łatwiej osadzić assety. |
| D6 | **Hot-seat** (dwóch graczy przy jednym ekranie, brak auth, brak networking) | Warsztat 1,5 h, bez sensu komplikować. |
| D7 | **Plik stanu = jeden mecz = jeden plik** w `data/matches/{matchId}.json` | Najprostszy model danych dający się czytać oczami. |
| D8 | **Atomic write** (zapis do `*.tmp` + `rename`) | Klikam szybko → nie chcę uszkodzić pliku. Skill: `file-io-safety`. |
| D9 | **`Move` jako discriminated union per gra** | Engine waliduje strukturalnie, gra waliduje semantycznie. |
| D10 | **Engine zna tylko: 2 graczy / tury / kwadratowa plansza / pionki B/C / klikalność** | Wszystko inne deklaruje gra. To jest puenta architektoniczna. |
| D11 | **Bez bazy danych, bez Redisa, bez serwera stanu** | Pliki JSON w repo wystarczają. |
| D12 | **Dev server: `next dev` (Webpack)**, nie `--turbopack` | Stabilność > marginalny zysk czasu kompilacji w demo. |
| D13 | **Meta-agent dostarczania (`agents/workshop-producer.md`) żyje obok czterech ról specjalistycznych** | Cztery role (orchestrator, architect, backend-developer, frontend-developer) są częścią **curriculum** warsztatu — to one są przykładem systemu wieloagentowego, który pokazujemy uczestnikom. Workshop-producer jest **meta-agentem dostarczania** — odpowiada za pchnięcie planu z `01-action-plan.md` o jeden inkrement w każdym wywołaniu, nie ma roli w prezentowanym systemie. Współdzieli folder `agents/` z czterema rolami dla spójności formatu pliku, ale jego scope jest rozłączny i nie jest cytowany w prezentacji. |

---

## 5. Pytania otwarte do prowadzącego

Spisujemy zamiast improwizować — prowadzący decyduje przed warsztatem.

1. **Lista zadań „dopnij funkcję” do vibe codingu** — kto przygotuje 3–5 zadań (poziom: 5–15 minut z AI copilotem)? Propozycje:
   - „Pokaż licznik ruchów w UI”.
   - „Dodaj animację podświetlenia ostatniego ruchu”.
   - „Dorzuć przycisk «Nowa gra»”.
   - „Pokaż historię ruchów obok planszy”.
   - „Walidacja: nie pozwól ruszyć, jeśli gra rozstrzygnięta”.
2. **Czy uczestnicy fork-ują repo czy pracują na swoich kopiach lokalnych?** Zalecane: lokalna kopia, brak presji PR-ów w 10 minut.
3. **Który darmowy AI copilot rekomendujemy domyślnie** — ChatGPT (ze wstępnie wklejonym kontekstem repo), Cursor (free tier), inny? Wpływa to na instrukcję w slajdzie 9.
4. **Co z deploymentem?** MVP zakłada lokalny `npm run dev`. Vercel/Netlify nie są wymagane — czy jest sens dorzucać konfigurację dla chętnych po warsztacie?
5. **Czy chcemy nagranie / zapis prezentacji?** Jeżeli tak, prezentacja powinna mieć tryb prezentera (notatki) — nie ma w MVP, do rozważenia w iteracji 8.

---

## 6. Ryzyka i mitygacje

| Ryzyko | Mitygacja |
|---|---|
| Ktoś nie ma Node’a / ma stary | Sekcja README z linkiem do nvm, sprawdzane w iteracji 10. |
| Wolny internet → `npm install` ciągnie się 5 min | Pre-cache zależności na stacji prowadzącego, opcjonalnie pendrive z `node_modules.tar.gz`. |
| Vibe coding nie zmieści się w 10 min | Zadania kalibrowane na 5–8 min, prowadzący ma fallback ze swojego AI. |
| Któryś agent / ADR po polsku przez nieuwagę | Lint manualny w iteracji 10 — sekcja 7 promptu jest sztywna. |
