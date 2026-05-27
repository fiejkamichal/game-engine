import { listGames } from "@/lib/games-registry";

import { NewMatchButton } from "./_components/new-match-button";

export default function Home() {
  const games = listGames();

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-12 px-6 py-16">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
          AI Generation w praktyce
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-neutral-50">
          Turn-based game engine
        </h1>
        <p className="max-w-2xl text-lg text-neutral-300">
          Jeden silnik, dwie gry referencyjne, cztery role agentów AI. Wybierz
          grę i zacznij mecz — stan zapisze się do pliku{" "}
          <code className="rounded bg-neutral-900 px-1.5 py-0.5 text-sm text-neutral-200">
            data/matches/&lt;id&gt;.json
          </code>
          .
        </p>
      </header>

      <section
        aria-label="Dostępne gry"
        className="grid gap-4 sm:grid-cols-2"
      >
        {games.map((game) => (
          <article
            key={game.id}
            className="flex flex-col gap-3 rounded-lg border border-neutral-800 bg-neutral-950 p-6"
          >
            <h2 className="text-xl font-semibold text-neutral-100">
              {game.displayName}
            </h2>
            <p className="text-sm text-neutral-400">
              Plansza {game.boardSize.rows}×{game.boardSize.cols}, hot-seat,
              dwóch graczy.
            </p>
            <div className="mt-auto pt-2">
              <NewMatchButton gameId={game.id} />
            </div>
          </article>
        ))}
      </section>

      <footer className="text-xs text-neutral-600">
        Architektura: silnik agnostyczny względem gry (
        <code className="text-neutral-500">packages/engine/</code>
        ), gry jako moduły (
        <code className="text-neutral-500">packages/games/*/</code>
        ). Dodanie trzeciej gry = nowy folder, zero zmian w silniku — patrz
        ADR 0001.
      </footer>
    </main>
  );
}
