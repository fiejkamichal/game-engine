import { listGames } from "@/lib/games-registry";

import { NewMatchButton } from "./_components/new-match-button";

export default function Home() {
  const games = listGames();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-10 px-[max(1.5rem,9vw)] py-[10vh]">
      <header className="flex flex-col gap-3">
        <p className="eyebrow">AI Generation w praktyce</p>
        <h1>
          Turn-based <span className="accent">game engine</span>
        </h1>
        <p className="lead max-w-[60ch]">
          Jeden silnik, dwie gry referencyjne, cztery role agentów AI. Wybierz
          grę i zacznij mecz — stan zapisze się do pliku{" "}
          <code>data/matches/&lt;id&gt;.json</code>.
        </p>
      </header>

      <section
        aria-label="Dostępne gry"
        className="grid gap-[2.6vw] sm:grid-cols-2"
      >
        {games.map((game) => (
          <article key={game.id} className="card">
            <h3>{game.displayName}</h3>
            <p>
              Plansza {game.boardSize.rows}×{game.boardSize.cols}, hot-seat,
              dwóch graczy.
            </p>
            <div className="mt-auto pt-2">
              <NewMatchButton gameId={game.id} />
            </div>
          </article>
        ))}
      </section>

      <footer className="text-fg-3 text-sm">
        Architektura: silnik agnostyczny względem gry (
        <code>packages/engine/</code>), gry jako moduły (
        <code>packages/games/*/</code>). Dodanie trzeciej gry = nowy folder,
        zero zmian w silniku — patrz ADR 0001.
      </footer>
    </main>
  );
}
