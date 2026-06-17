# Instalacja od zera / Setup from zero

**[Polski](#polski) · [English](#english)**

---

<a id="polski"></a>

# Instalacja od zera — przewodnik dla uczestników

> Materiał do wysłania uczestnikom **przed** warsztatem
> „AI Generation w praktyce: Od teorii do zastosowania".
> Jeśli masz już Node, Gita i edytor — przeskocz od razu do **Kroku 5**.
> English version below: **[jump to English](#english)**.

## Czego potrzebujesz

- Laptop z **Windows 10/11** albo **Linux** (Ubuntu/Debian/Fedora — dowolna świeża dystrybucja).
- Połączenie z internetem.
- ~20 minut przed warsztatem (instalacja zależności potrafi chwilę zająć).
- Opcjonalnie: konto u darmowego copilota AI (patrz Krok 4) — przyda się w części praktycznej.

Wszystkie polecenia z kroków poniżej wpisujesz w **terminalu**. Najwygodniej w zintegrowanym terminalu edytora (Krok 3): w Cursorze i VS Code otwierasz go skrótem `` Ctrl+` `` albo z menu *Terminal → New Terminal*. Na Windows działa też PowerShell, na Linuksie zwykły terminal.

---

## Krok 1 — Node.js (LTS, wersja ≥ 20) + npm (≥ 10)

`npm` instaluje się **razem z** Node.js — nie trzeba go dokładać osobno.

### Windows

Najprościej przez menedżer pakietów `winget` (wbudowany w Windows 11 i nowsze Windows 10):

```powershell
winget install OpenJS.NodeJS.LTS
```

Alternatywnie: pobierz instalator „LTS" ze strony <https://nodejs.org> i przeklikaj kreator (zostaw domyślne opcje).

> Po instalacji **zamknij i otwórz terminal na nowo**, żeby odświeżył ścieżki (PATH).

### Linux

Zalecane: `nvm` (Node Version Manager) — nie wymaga `sudo` i łatwo zmieniać wersje:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
# zamknij i otwórz terminal, potem:
nvm install --lts
```

Alternatywnie, pakiet z dystrybucji (wersja bywa starsza — sprawdź, czy to ≥ 20):

```bash
# Debian / Ubuntu
sudo apt update && sudo apt install nodejs npm
# Fedora
sudo dnf install nodejs
```

### Weryfikacja (oba systemy)

```bash
node --version   # oczekiwane: v20.x.x lub nowsze
npm --version    # oczekiwane: 10.x.x lub nowsze
```

---

## Krok 2 — Git

### Windows

```powershell
winget install Git.Git
```

Albo instalator ze strony <https://git-scm.com> (domyślne opcje są OK). Po instalacji otwórz terminal na nowo.

### Linux

```bash
# Debian / Ubuntu
sudo apt install git
# Fedora
sudo dnf install git
```

### Weryfikacja

```bash
git --version    # oczekiwane: dowolne 2.x.x
```

---

## Krok 3 — Edytor kodu

Wybierz **jeden** (oba mają wbudowany terminal i wsparcie AI — na warsztacie używamy jednego z nich):

- **Cursor** — edytor z wbudowanym asystentem AI. Pobierz: <https://cursor.com>.
  Windows: instalator `.exe`. Linux: plik `.AppImage` (nadaj prawo wykonywania: `chmod +x Cursor-*.AppImage`).
- **VS Code** — pobierz: <https://code.visualstudio.com>. Po instalacji dodaj wtyczkę
  **GitHub Copilot** (zakładka *Extensions* → wyszukaj „GitHub Copilot").

Po instalacji otwórz edytor i jego zintegrowany terminal (`` Ctrl+` ``) — kolejne kroki uruchamiaj właśnie tam.

---

## Krok 4 — Konto copilota AI (opcjonalne, ale zalecane)

Wystarczy **jedna** z opcji:

- **Cursor** — ma wbudowanego asystenta z darmowym limitem (załóż konto przy pierwszym uruchomieniu).
- **GitHub Copilot** — w VS Code/Cursorze (darmowy plan po zalogowaniu kontem GitHub).
- **Darmowy chat w przeglądarce** — gdy nie chcesz nic instalować: <https://chatgpt.com>,
  <https://claude.ai>, <https://gemini.google.com>.

Warsztat jest o tym **jak** używać AI, nie **czym** — dowolny z powyższych wystarczy.

---

## Krok 5 — Sklonuj repozytorium i uruchom lokalnie

W terminalu (najlepiej w edytorze), w katalogu, w którym trzymasz projekty:

```bash
git clone https://github.com/fiejkamichal/game-engine.git
cd game-engine
npm install
npm run dev
```

`npm install` przy pierwszym uruchomieniu pobiera zależności — może potrwać 1–3 minuty.

Następnie otwórz w przeglądarce <http://localhost:3000>.

---

## Weryfikacja — czy wszystko działa

- [ ] `node --version` zwraca v20 lub wyżej, `npm --version` zwraca 10 lub wyżej.
- [ ] `git --version` zwraca wersję.
- [ ] `npm run dev` startuje bez błędów i utrzymuje się (nie wraca od razu do znaku zachęty).
- [ ] Strona <http://localhost:3000> otwiera się i pokazuje listę gier.
- [ ] Klik **Nowy mecz** tworzy mecz i można w niego zagrać.

Jeśli wszystkie punkty są odhaczone — jesteś gotowy/a na warsztat.

---

## Najczęstsze problemy

- **`node`/`git`/`npm` „nie jest rozpoznawane jako polecenie"** — zamknij i otwórz terminal na nowo
  (po instalacji trzeba odświeżyć PATH). Jeśli nie pomoże — zrestartuj komputer.
- **Za stara wersja Node** (`node --version` < 20) — na Windows zainstaluj ponownie wersję LTS;
  na Linuksie użyj `nvm install --lts && nvm use --lts`.
- **`npm install` się wykłada** — usuń folder i spróbuj na świeżo:
  - Windows (PowerShell): `Remove-Item -Recurse -Force node_modules; npm install`
  - Linux: `rm -rf node_modules && npm install`
- **Proxy / firewall firmowy** blokuje pobieranie — spróbuj na sieci domowej / hotspocie z telefonu,
  albo zgłoś prowadzącemu (jest przygotowany wariant offline).
- **Port 3000 zajęty** — zamknij inną aplikację na tym porcie albo uruchom
  `npm run dev -- -p 3001` i otwórz `http://localhost:3001`.

Utknąłeś/aś? Przyjdź na warsztat 10 minut wcześniej albo napisz do prowadzącego — pomożemy ruszyć z miejsca.

---

<a id="english"></a>

# Setup from zero — participant guide

> Material to send to participants **before** the workshop
> "AI Generation in practice: From theory to application".
> Already have Node, Git and an editor? Skip straight to **Step 5**.
> Wersja polska wyżej: **[przejdź do polskiego](#polski)**.

## What you need

- A laptop with **Windows 10/11** or **Linux** (Ubuntu/Debian/Fedora — any recent distro).
- An internet connection.
- ~20 minutes before the workshop (installing dependencies can take a moment).
- Optional: an account with a free AI copilot (see Step 4) — handy for the practical part.

You type all the commands below in a **terminal**. Easiest is the editor's integrated terminal (Step 3): in Cursor and VS Code open it with `` Ctrl+` `` or from the menu *Terminal → New Terminal*. On Windows PowerShell works too; on Linux a regular terminal.

---

## Step 1 — Node.js (LTS, version ≥ 20) + npm (≥ 10)

`npm` is installed **together with** Node.js — no need to add it separately.

### Windows

Easiest via the `winget` package manager (built into Windows 11 and newer Windows 10):

```powershell
winget install OpenJS.NodeJS.LTS
```

Alternatively: download the "LTS" installer from <https://nodejs.org> and click through the wizard (keep the defaults).

> After installing, **close and reopen the terminal** so it refreshes the paths (PATH).

### Linux

Recommended: `nvm` (Node Version Manager) — no `sudo` required and easy to switch versions:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
# close and reopen the terminal, then:
nvm install --lts
```

Alternatively, the distro package (the version can be older — check it's ≥ 20):

```bash
# Debian / Ubuntu
sudo apt update && sudo apt install nodejs npm
# Fedora
sudo dnf install nodejs
```

### Verify (both systems)

```bash
node --version   # expected: v20.x.x or newer
npm --version    # expected: 10.x.x or newer
```

---

## Step 2 — Git

### Windows

```powershell
winget install Git.Git
```

Or the installer from <https://git-scm.com> (the defaults are fine). Reopen the terminal afterwards.

### Linux

```bash
# Debian / Ubuntu
sudo apt install git
# Fedora
sudo dnf install git
```

### Verify

```bash
git --version    # expected: any 2.x.x
```

---

## Step 3 — Code editor

Pick **one** (both have an integrated terminal and AI support — we use one of them at the workshop):

- **Cursor** — an editor with a built-in AI assistant. Download: <https://cursor.com>.
  Windows: `.exe` installer. Linux: an `.AppImage` file (make it executable: `chmod +x Cursor-*.AppImage`).
- **VS Code** — download: <https://code.visualstudio.com>. After installing, add the
  **GitHub Copilot** extension (*Extensions* tab → search for "GitHub Copilot").

After installing, open the editor and its integrated terminal (`` Ctrl+` ``) — run the next steps there.

---

## Step 4 — AI copilot account (optional, but recommended)

Any **one** of the options is enough:

- **Cursor** — has a built-in assistant with a free tier (create an account on first launch).
- **GitHub Copilot** — in VS Code/Cursor (free plan after signing in with a GitHub account).
- **Free browser chat** — when you don't want to install anything: <https://chatgpt.com>,
  <https://claude.ai>, <https://gemini.google.com>.

The workshop is about **how** to use AI, not **which** — any of the above will do.

---

## Step 5 — Clone the repository and run it locally

In the terminal (ideally inside the editor), in the folder where you keep your projects:

```bash
git clone https://github.com/fiejkamichal/game-engine.git
cd game-engine
npm install
npm run dev
```

On the first run `npm install` downloads the dependencies — this can take 1–3 minutes.

Then open <http://localhost:3000> in your browser.

---

## Verify — is everything working

- [ ] `node --version` returns v20 or higher, `npm --version` returns 10 or higher.
- [ ] `git --version` returns a version.
- [ ] `npm run dev` starts without errors and keeps running (doesn't return to the prompt immediately).
- [ ] <http://localhost:3000> opens and shows the game list.
- [ ] Clicking **Nowy mecz** ("New match") creates a match and you can play it.

If every box is checked — you're ready for the workshop.

---

## Common problems

- **`node`/`git`/`npm` "is not recognized as a command"** — close and reopen the terminal
  (PATH needs to refresh after installing). If that doesn't help — restart the computer.
- **Node too old** (`node --version` < 20) — on Windows reinstall the LTS version;
  on Linux use `nvm install --lts && nvm use --lts`.
- **`npm install` fails** — delete the folder and try fresh:
  - Windows (PowerShell): `Remove-Item -Recurse -Force node_modules; npm install`
  - Linux: `rm -rf node_modules && npm install`
- **Corporate proxy / firewall** blocks downloads — try a home network / phone hotspot,
  or tell the facilitator (an offline variant is prepared).
- **Port 3000 busy** — close the other app using it, or run
  `npm run dev -- -p 3001` and open `http://localhost:3001`.

Stuck? Come to the workshop 10 minutes early or message the facilitator — we'll get you going.
