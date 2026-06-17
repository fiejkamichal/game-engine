import { getTranslations } from "next-intl/server";

import { listGames } from "@/lib/games-registry";

import { NewMatchButton } from "./_components/new-match-button";

export default async function Home() {
  const games = listGames();
  const t = await getTranslations("home");
  const tGames = await getTranslations("games");

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-10 px-[max(1.5rem,9vw)] py-[10vh]">
      <header className="flex flex-col gap-3">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h1>
          {t.rich("title", {
            accent: (chunks) => <span className="accent">{chunks}</span>,
          })}
        </h1>
        <p className="lead max-w-[60ch]">
          {t.rich("lead", {
            code: (chunks) => <code>{chunks}</code>,
          })}
        </p>
      </header>

      <section
        aria-label={t("gamesLabel")}
        className="grid gap-[2.6vw] sm:grid-cols-2"
      >
        {games.map((game) => (
          <article key={game.id} className="card">
            <h3>
              {tGames.has(`${game.id}.name`)
                ? tGames(`${game.id}.name`)
                : game.displayName}
            </h3>
            <p>
              {t("gameCardInfo", {
                rows: game.boardSize.rows,
                cols: game.boardSize.cols,
              })}
            </p>
            <div className="mt-auto pt-2">
              <NewMatchButton gameId={game.id} />
            </div>
          </article>
        ))}
      </section>

      <footer className="text-fg-3 text-sm">
        {t.rich("footer", {
          code: (chunks) => <code>{chunks}</code>,
        })}
      </footer>
    </main>
  );
}
