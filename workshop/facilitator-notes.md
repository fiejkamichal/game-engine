# Ściąga prowadzącego — „AI Generation w praktyce"

> Materiał roboczy. Polski. Wersja na 90 minut, hot-seat (laptop prowadzącego = ekran).
> Punkty odniesienia: [`plan/00-bootstrap-prompt.md`](./plan/00-bootstrap-prompt.md),
> [`plan/01-action-plan.md`](./plan/01-action-plan.md), [`plan/02-progress.md`](./plan/02-progress.md).

## Przed warsztatem (T-1 dzień)

- [ ] `git pull && npm install && npm run dev` na laptopie prowadzącego — sprawdzić, że strona startuje na `http://localhost:3000` i że tworzenie meczu działa dla obu gier.
- [ ] Otworzyć `presentation/index.html` dwuklikiem w przeglądarce, F12 → Network: ma być pusto (0 requestów po refresh).
- [ ] Spakować `node_modules.tar.gz` (`tar -czf node_modules.tar.gz node_modules`) na pendrive. Mitygacja na wypadek wolnego/braku internetu — patrz fallback F1.
- [ ] Sprawdzić darmowy AI copilot, którego rekomendujesz uczestnikom (ChatGPT free / Cursor free). Mieć przygotowany pre-prompt z linkiem do repo.
- [ ] Skasować pliki `data/matches/*.json` z testów (są ignorowane przez Git, ale mogą zaśmiecać UI).

## Materiały, które musisz mieć otwarte

- Karta z prezentacją (`presentation/index.html`) — pełny ekran, F11.
- Druga karta z aplikacją (`http://localhost:3000`).
- Edytor (Cursor/VS Code) z otwartymi:
  - `packages/engine/src/types.ts`
  - `packages/games/tic-tac-toe/src/index.ts`
  - `packages/games/checkers/src/index.ts`
  - `agents/orchestrator.md`
- Terminal z aktywnym `npm run dev` (zostawić, nie restartować w trakcie warsztatu).

## Timing — 90 minut

Każda linia to *kiedy zaczyna się slajd / blok*. Trzymaj się ±2 min.

| Min       | Slajd / blok                  | O czym mówisz                                                                                              | Kontrola                                                                                  |
|-----------|-------------------------------|------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------|
| 00:00     | 1 — Tytuł                     | Witam, kto ja, kontekst warsztatu, agenda jednym zdaniem.                                                  | —                                                                                         |
| 02:00     | 2 — Agenda                    | „30 min teorii, 50 min praktyki, 10 min Q&A. Pytania zbieramy na koniec, chyba że coś przerywa zrozumienie." | Zapytaj kto ma konto AI; jeśli brak — przekieruj do założenia w ciągu pierwszej teorii.   |
| 05:00     | 3 — Krajobraz                 | Pozycjonowanie: prompt → RAG → agent. RAG tylko jako kontrast, nie temat.                                  | „Kto wie, co to RAG?" Szybkie kciuki.                                                     |
| 12:00     | 4 — Czym JEST i NIE JEST agent | Lewa kolumna: pętla obserwacja→decyzja→akcja. Prawa: czym agent **nie** jest (prompt, chatbot, RAG, skill). | „Powiedzcie mi przykład agenta, który widzieliście" — 1-2 odpowiedzi.                     |
| 20:00     | 5 — Architektura              | Cztery role z naszego repo. Orchestrator jako jedyny interfejs do człowieka.                               | Pokaż `agents/orchestrator.md` w edytorze (sekcja Boundaries).                            |
| 28:00     | 6 — Skille vs agenci          | Skill = procedura. Agent = decydent z autonomią. Skill jest *używany*, nie *wywoływany*.                   | „Ktoś rozumie, czemu to ważne?" Krótka dyskusja.                                          |
| 33:00     | 7 — Wzorzec promptu           | Pięć rubryk: rola → cel → zakres → ograniczenia → kontrakt wyjścia. Pokaż na żywo `agents/architect.md`.   | —                                                                                         |
| 38:00     | 8 — Repo (1/3)                | Drzewo katalogów. Klucz: *engine* obok *games*, *agents* obok *skills*, *workshop/plan*.                   | Pokaż folder w edytorze.                                                                  |
| 41:00     | 9 — Kontrakt (2/3)            | `GameDefinition` po lewej, ttt `validateMove` po prawej. Cztery linie kontraktu, ~10 linii implementacji.   | Pokaż `packages/engine/src/types.ts` i `packages/games/tic-tac-toe/src/index.ts`.         |
| 45:00     | 10 — Druga gra (3/3)          | Warcaby `validateMove` + bramka `git diff HEAD~1 -- packages/engine/ = 0 linii`.                           | Wykonaj komendę na żywo w terminalu, niech wynik mówi sam.                                |
| 49:00     | 11 — Vibe Coding (instrukcja) | Jak pracować: krótkie cykle, kontekst (`agents/*.md` + odpowiedni `GameDefinition`), 10 minut na rezultat. | „Kto już używał AI copilota?" Kciuki.                                                     |
| 52:00     | 12 — Zadanie                  | Kryteria sukcesu + lista zadań (sekcja niżej w tym pliku).                                                 | Wybierzcie zadanie, otwórzcie copilota, **start**.                                        |
| 55:00     | **PRAKTYKA**                  | Uczestnicy kodują. Ty chodzisz między rzędami / na Discordzie.                                             | Po 5, 10, 15 min — szybki check „jak idzie?". Pomóż przy `npm install`, błędach buildu.   |
| 80:00     | 13 — Q&A                      | „Co działało, co nie. Co warto wziąć do swojego projektu."                                                 | Zaproś 2-3 uczestników do podzielenia się wynikiem.                                       |
| 88:00     | Domknięcie                    | Repo zostaje. Link do `workshop/plan/`. Materiały publicznie. Podziękowanie.                               | —                                                                                         |

## Momenty kontroli (skróty)

Te punkty pokazują, czy idziesz w dobrym tempie. Jeżeli któryś nie zaskakuje — przyspiesz, zwolnij, lub przejdź dalej.

1. **Po 8 min** — slajd 4 nie zaczęty: za wolno. Skracaj.
2. **Po 25 min** — slajd 6 (skille) nie zaczęty: za wolno. Slajd 3 i 4 mogły być za bogate. Skracaj resztę teorii o 2 min na slajd.
3. **Po 40 min** — repo niezaczęte: prawdopodobnie utknąłeś na pytaniach. **Stop pytaniom.** Q&A jest na końcu.
4. **Po 55 min** — praktyka nieuruchomiona: krytyczne. Skracaj zadanie do najmniejszego (patrz Z1 niżej), nie tłumacz drugi raz.
5. **W trakcie praktyki**: jeśli >30% uczestników utyka na uruchomieniu repo → **F3** (live demo na ekranie zamiast pracy własnej).
6. **Po 85 min** — Q&A nieotwarte: domykasz natychmiast, nawet kosztem urwania slajdu 12.

## Lista zadań „dopnij funkcję" do Vibe Codingu

Posortowane od najprostszego (Z1) do najtrudniejszego (Z5). Sugeruj Z1-Z2 dla początkujących, Z3-Z4 dla średnio-zaawansowanych. Każde mieści się w 5-12 minut z dobrym copilotem.

### Z1 — Licznik ruchów

Dodaj na stronie meczu (`apps/web/app/match/[id]/match-board.tsx`) licznik wyświetlający `state.history.length`, np. „Ruch nr 5". Kryterium sukcesu: licznik się aktualizuje po każdym kliknięciu.

### Z2 — Animacja podświetlenia ostatniego ruchu

Po wykonaniu ruchu pole, na które padł, błyska na 1 sekundę (np. `animate-pulse` z Tailwind). Wskazówka: `state.history[state.history.length - 1]` daje ostatni ruch.

### Z3 — Przycisk „Reset matchu"

Dodaj przycisk „Nowy mecz tej samej gry" na stronie meczu — POST do `/api/matches` z `gameId` aktualnego meczu i redirect na nowy id. UI helper `getGameUi` daje dostęp do `state.gameId`.

### Z4 — Statystyka „kto ile wygrał"

Na stronie głównej dodaj sekcję z licznikami: ile zakończonych meczów wygrał biały, ile czarny, ile remisów (przeczytaj wszystkie pliki w `data/matches/` — server component, użyj `apps/web/lib/file-io.ts`).

### Z5 — Trzecia gra

Wzór: skopiuj `packages/games/tic-tac-toe/` na `packages/games/connect-4-mini/` (np. 4×4 plansza, 3 w rzędzie wygrywa). Zarejestruj w `apps/web/lib/games-registry.ts`. **Bramka jakości:** dodanie tej gry **nie wymaga** zmian pod `packages/engine/`. Jeżeli musisz coś tam zmienić — sygnał, że kontrakt jest niekompletny.

## Fallbacki

### F1 — Wolny/brak internetu

- Wskaż uczestnikom pendrive z `node_modules.tar.gz`. Polecenie:
  `tar -xzf node_modules.tar.gz` w katalogu repo zamiast `npm install`.
- Jeśli brak też kont AI — przejdź na **F3** (live demo).

### F2 — Konkretny błąd `npm install`

- Sprawdź wersję Node (`node --version`). Wymagane LTS ≥20.0.0.
- `rm -rf node_modules && npm install` na świeżo.
- Jeżeli dalej nie idzie — przesiądź uczestnika na ekran prowadzącego.

### F3 — Live demo zamiast pracy własnej

Jeśli sekcja praktyczna się sypie:

1. Pokaż na swoim ekranie zadanie Z1 (licznik ruchów). Wpisuj na żywo, pytaj uczestników co napisać dalej, gdzie znaleźć kontekst dla copilota.
2. Pokaż czytanie `agents/frontend-developer.md` + odpowiedni `GameDefinition` jako kontekst dla AI.
3. Skomituj na żywo — pokaż format `feat:` (skille `commit-message.md`).
4. Zostawia to uczestników z konkretnym przebiegiem do powtórzenia po warsztacie.

### F4 — Pytanie typu „a czy mogę zrobić X"

Domyślna odpowiedź: „Tak, prawdopodobnie tak. Spróbuj — w pesymistycznym scenariuszu skończysz z odrzuconym commitem i nauką. W repo nic się nie wydarzy nieodwracalnego, bo `data/matches/*.json` jest ignorowane przez Git." Nie wchodź w detal w trakcie warsztatu, zapisz pytanie do Q&A.

## Cheat sheet referencyjny

Najczęstsze pytania uczestników i krótka odpowiedź + plik do otwarcia.

| Pytanie                                              | Odpowiedź jednym zdaniem                                                       | Plik do otwarcia                                                  |
|------------------------------------------------------|--------------------------------------------------------------------------------|-------------------------------------------------------------------|
| „Gdzie jest 'mózg' agenta?"                          | W definicji w `agents/*.md` — to spec, nie kod.                                | `agents/orchestrator.md`                                          |
| „Kto wywołuje engine?"                               | API routes w `apps/web/app/api/matches/.../route.ts`.                          | `apps/web/app/api/matches/[id]/moves/route.ts`                    |
| „Gdzie zapisuje się stan?"                           | `data/matches/{matchId}.json`, atomic write (skill).                           | `apps/web/lib/file-io.ts` + `skills/file-io-safety.md`            |
| „Czemu engine nie zna gier?"                         | Decyzja architektoniczna, patrz ADR 0001.                                      | `docs/architecture/0001-engine-vs-game-split.md`                  |
| „Jak działa walidacja ruchu?"                        | 6-stopniowy flow z ADR 0002 — engine routuje, gra decyduje.                    | `docs/architecture/0002-game-definition-contract.md`              |
| „Co jeśli plik stanu się popsuje?"                   | Atomic write + `schemaVersion: 1` na wejściu — skill `file-io-safety.md`.      | `skills/file-io-safety.md`                                        |
| „Jak ma wyglądać commit?"                            | Conventional Commits — skill `commit-message.md`.                              | `skills/commit-message.md`                                        |
| „Jak dodać trzecią grę?"                             | Z5 niżej. Folder pod `packages/games/`, jedna linia w `games-registry.ts`.     | `packages/games/checkers/src/index.ts` (wzór)                     |

## Po warsztacie

- [ ] Wyczyść `data/matches/*.json` (z testów uczestników, jeśli pracowali na laptopie prowadzącego).
- [ ] Zrób krótką notatkę: co działało, co kuło, co zmienić w następnej iteracji. Dodaj jako sekcję u dołu `workshop/plan/02-progress.md` albo nowy plik `workshop/retros/YYYY-MM-DD.md`.
- [ ] Podziel się linkiem do repo (zostaje publiczne).
