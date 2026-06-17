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
- [ ] **Z wyprzedzeniem** (T-3 do T-1 dzień) wysłać uczestnikom przewodnik instalacji od zera — [`installation-guide.md`](./installation-guide.md) (lub wklejona treść z sekcji niżej). Pozwala dojść na warsztat z gotowym środowiskiem.

## Pakiet instalacyjny dla uczestników (do wysyłki)

> Skrót do skopiowania na maila / Discorda. Pełna wersja z troubleshootingiem: [`installation-guide.md`](./installation-guide.md).
> Pokrycie: Windows + Linux. Wszystkie komendy wpisuje się w terminalu (najwygodniej w zintegrowanym terminalu edytora, `` Ctrl+` ``).

**Krok 1 — Node.js LTS (≥ 20) + npm (≥ 10)** (npm instaluje się razem z Node):

- Windows: `winget install OpenJS.NodeJS.LTS` (albo instalator LTS z <https://nodejs.org>).
- Linux: `nvm install --lts` (albo `sudo apt install nodejs npm` / `sudo dnf install nodejs`).
- Weryfikacja: `node --version` (≥ v20), `npm --version` (≥ 10). Po instalacji otwórz terminal na nowo.

**Krok 2 — Git:**

- Windows: `winget install Git.Git` (albo <https://git-scm.com>).
- Linux: `sudo apt install git` / `sudo dnf install git`.
- Weryfikacja: `git --version`.

**Krok 3 — Edytor (do wyboru):** Cursor (<https://cursor.com>) albo VS Code (<https://code.visualstudio.com>) + wtyczka GitHub Copilot. Komendy z kolejnych kroków odpalasz w jego zintegrowanym terminalu.

**Krok 4 — Konto AI (opcjonalne):** wbudowany Cursor (free) / GitHub Copilot / darmowy chat (<https://chatgpt.com>, <https://claude.ai>, <https://gemini.google.com>).

**Krok 5 — Sklonuj i uruchom:**

```bash
git clone https://github.com/fiejkamichal/game-engine.git
cd game-engine
npm install
npm run dev
```

Otwórz <http://localhost:3000>.

**Weryfikacja:** strona startuje, widać listę gier, „Nowy mecz" tworzy mecz i da się zagrać.

## Materiały, które musisz mieć otwarte

- Karta z prezentacją (`presentation/index.html`) — pełny ekran, F11.
- Druga karta z aplikacją (`http://localhost:3000`).
- Edytor (Cursor/VS Code) z otwartymi:
  - `packages/engine/src/types.ts`
  - `packages/games/tic-tac-toe/src/index.ts`
  - `packages/games/checkers/src/index.ts`
  - `agents/orchestrator.md` (slajd 9 — live demo wzorca promptu)
  - `skills/commit-message.md` (slajd 8 — przykład skilla)
- Terminal z aktywnym `npm run dev` (zostawić, nie restartować w trakcie warsztatu).

## Timing — 90 minut

Każda linia to *kiedy zaczyna się slajd / blok*. Trzymaj się ±2 min.

| Min       | Slajd / blok                   | O czym mówisz                                                                                              | Kontrola                                                                                  |
|-----------|--------------------------------|------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------|
| 00:00     | 1 — Tytuł                      | Witam, kto ja, kontekst warsztatu, agenda jednym zdaniem.                                                  | —                                                                                         |
| 02:00     | 2 — Agenda                     | „~30 min teorii, ~50 min praktyki, ~10 min Q&A. Pytania na koniec, chyba że coś przerywa zrozumienie."     | Zapytaj kto ma konto AI; jeśli brak — przekieruj do założenia w trakcie pierwszej teorii. |
| 05:00     | 3 — Vibe coding (otwarcie)     | Definicja jednym zdaniem + zapowiedź: „zbudujemy razem drabinę warstw od dołu do góry".                    | Kciuki: kto już używał AI copilota?                                                       |
| 07:00     | 4 — LLM (warstwa 1)            | Funkcja tekst → tekst. Bez stanu, bez pamięci, bez narzędzi. Krótko.                                       | —                                                                                         |
| 10:00     | 5 — Prompt + inferencja (w. 2) | System / history / user sklejone w jeden tekst = jedna inferencja. Token window jako twardy limit.         | —                                                                                         |
| 13:00     | 6 — Aplikacja-host (w. 3)      | ChatGPT/Cursor/Copilot to NIE LLM-y — to hosty. Dodają system prompt, context management, UI.              | „Ten sam LLM, dwie aplikacje, inne zachowanie" — przykład z życia, 30 s.                  |
| 16:00     | 7 — Narzędzia (w. 4)           | Mechanizm tool call w 3 krokach + przykład JSON. Fundament dla skilli i agentów.                           | —                                                                                         |
| 19:00     | 8 — Skille (w. 5)              | Markdown w repo, wstrzykiwany do kontekstu. Pokaż listę z `skills/`.                                       | Otwórz `skills/commit-message.md` jako przykład formy.                                    |
| 23:00     | 9 — Agenci (w. 6)              | Pięciorubryczny wzorzec promptu + „Agent NIE jest". Live demo na `agents/orchestrator.md`.                  | Pokaż plik w edytorze, palcem po sekcjach Role/Mission/Boundaries/Tools.                  |
| 28:00     | 10 — Subagenci (w. 7)          | Subagent = narzędzie z perspektywy rodzica. W Cursorze: `Task` tool. Po co: izolacja + specjalizacja.       | —                                                                                         |
| 31:00     | 11 — Orkiestracja (w. 8)       | 4 role z repo + 1 interfejs do człowieka. Otwórz `agents/orchestrator.md` sekcja Boundaries.               | —                                                                                         |
| 34:00     | 12 — Way of working (w. 9)     | Codzienna praktyka: 1 prompt po polsku → orchestrator dzieli → specjaliści piszą → review → iteracja.      | —                                                                                         |
| 36:00     | 13 — Repo (1/3)                | Drzewo katalogów. Klucz: *engine* obok *games*, *agents* obok *skills*, *workshop/plan*.                   | Pokaż folder w edytorze.                                                                  |
| 39:00     | 14 — Kontrakt (2/3)            | `GameDefinition` po lewej, ttt `validateMove` po prawej. Cztery linie kontraktu, ~10 linii implementacji.   | Pokaż `packages/engine/src/types.ts` i `packages/games/tic-tac-toe/src/index.ts`.         |
| 43:00     | 15 — Druga gra (3/3)           | Warcaby `validateMove` + bramka `git diff HEAD~1 -- packages/engine/ = 0 linii`.                           | Wykonaj komendę na żywo w terminalu, niech wynik mówi sam.                                |
| 47:00     | **16 — Przerwa na kawę**       | ~7 min. Wstać, rozprostować nogi, sięgnąć po kubek. Kto nie ma jeszcze konta w copilocie — teraz.          | Pilnuj zegara — nie więcej niż 8 min, inaczej praktyka się sypie.                         |
| 54:00     | 17 — Zadania do wyboru         | „Oto co możecie zrobić" — przejedź po Z1-Z5 jednym zdaniem każde, podpowiedz poziomy trudności.            | Niech każdy w głowie wybierze zanim pokażesz instrukcję.                                  |
| 57:00     | 18 — Vibe Coding (instrukcja)  | „A oto jak to zrobić" — konkretne komendy, gdzie wkleić kontekst, co to znaczy „krótkie cykle".            | Kciuki — kto już sklonował repo?                                                          |
| 60:00     | 19 — Zadanie (kryteria)        | Kryteria sukcesu: działa po odświeżeniu, nie psuje drugiej gry, jeden commit conventional.                 | „Otwórzcie copilota, **start**."                                                          |
| 62:00     | **PRAKTYKA**                   | Uczestnicy kodują. Ty chodzisz między rzędami / na Discordzie.                                             | Po 5, 10, 15 min — szybki check „jak idzie?". Pomóż przy `npm install`, błędach buildu.   |
| 82:00     | 20 — Q&A                       | „Co działało, co nie. Co warto wziąć do swojego projektu."                                                 | Zaproś 2-3 uczestników do podzielenia się wynikiem.                                       |
| 88:00     | Domknięcie                     | Repo zostaje. Link do `workshop/plan/`. Materiały publicznie. Podziękowanie.                               | —                                                                                         |

## Momenty kontroli (skróty)

Te punkty pokazują, czy idziesz w dobrym tempie. Jeżeli któryś nie zaskakuje — przyspiesz, zwolnij, lub przejdź dalej.

1. **Po 13 min** — slajd 6 (Aplikacja-host) nie zaczęty: za wolno. Warstwy LLM i prompt mogły zająć za dużo. Skracaj.
2. **Po 23 min** — slajd 9 (Agenci) nie zaczęty: za wolno. Skracaj subagentów/orkiestrację/way-of-working do absolutnego minimum (po 1-2 min każdy).
3. **Po 36 min** — slajd 13 (Repo) niezaczęty: prawdopodobnie utknąłeś na pytaniach do teorii. **Stop pytaniom.** Q&A jest na końcu.
4. **Po 47 min** — przerwa nieotwarta: za wolno z teorią. Otwieraj przerwę natychmiast, slajdy 17-19 skróć (zostały już tylko logistyczne).
5. **Po 62 min** — praktyka nieuruchomiona: krytyczne. Skracaj zadanie do najmniejszego (Z1), nie tłumacz drugi raz.
6. **W trakcie praktyki**: jeśli >30% uczestników utyka na uruchomieniu repo → **F3** (live demo na ekranie zamiast pracy własnej).
7. **Po 85 min** — Q&A nieotwarte: domykasz natychmiast, nawet kosztem urwania slajdu 19 (Zadanie).

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

Wzór: skopiuj `packages/games/tic-tac-toe/` na `packages/games/othello-mini/`. Implementacja uproszczonego Othello — plansza 6×6, start z czterema pionami w środku (białe na `(2,3)` i `(3,2)`, czarne na `(2,2)` i `(3,3)`). Ruch: postaw piona na pustym polu tak, by w którymś z 8 kierunków (poziom, pion, skos) zamknąć ciąg ≥1 pionów przeciwnika między nowym pionem a innym pionem własnym; wszystkie zamknięte piony zmieniają właściciela. Koniec gry: plansza pełna albo żaden gracz nie ma legalnego ruchu — wygrywa kto ma więcej pionów (równo = remis).

Zarejestruj w `apps/web/lib/games-registry.ts` i dodaj wpis do `apps/web/lib/games-ui.ts` (`maxSelection: 1`, `●` w innym kolorze dla każdego gracza — najbliżej tic-tac-toe). **Podpowiedź:** wydziel helper `flipsForMove(state, cell)` zwracający listę pól do odwrócenia — `validateMove` odrzuca ruch, gdy lista pusta; `applyMove` używa tej samej listy do mutacji planszy.

**Bramka jakości:** dodanie tej gry **nie wymaga** zmian pod `packages/engine/`. Jeżeli musisz coś tam zmienić — sygnał, że kontrakt jest niekompletny.

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
| „Czym ChatGPT różni się od Cursora?"                 | Tym samym LLM-em pod spodem — różnią się aplikacją-hostem (system prompt, kontekst kodu, narzędzia). | slajd 6, `agents/orchestrator.md` jako przykład system promptu    |
| „Co to dokładnie jest system prompt?"                | Pierwszy tekst, który aplikacja podsuwa LLM-owi przed twoimi wiadomościami; nadaje rolę i reguły gry. | slajd 5 + 6                                                       |
| „Czym agent różni się od skilla?"                    | Skill mówi *jak* (procedura), agent mówi *kto* (rola, cel, granice). Skill jest *używany* przez agenta. | slajd 8 + 9, `skills/README.md` (tabela skill vs agent)           |
| „Po co mi subagent, skoro mogę zlecić to samo rodzicowi?" | Izolacja kontekstu (nie zaśmieca rodzica), specjalizacja (inny system prompt), równoległość. | slajd 10                                                          |
| „Co jeśli LLM mi halucynuje?"                        | Ograniczaj kontekst do precyzyjnych plików, używaj kontraktów typów (TypeScript wyłapie część bzdur), krótkie cykle. | `packages/engine/src/types.ts` (kontrakt), `agents/orchestrator.md` (Done criteria) |
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
