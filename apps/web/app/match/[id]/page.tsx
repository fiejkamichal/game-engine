import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import type { GameState } from "@game-engine/engine";

import {
  getMatchFilePath,
  isValidMatchId,
  readJsonFile,
} from "@/lib/file-io";
import { getGame } from "@/lib/games-registry";

import { MatchBoard } from "./match-board";

interface Props {
  readonly params: Promise<{ readonly id: string }>;
}

export default async function MatchPage({ params }: Props) {
  const { id } = await params;

  if (!isValidMatchId(id)) {
    notFound();
  }

  const state = await readJsonFile<GameState>(getMatchFilePath(id)).catch(
    () => null,
  );
  if (state === null) {
    notFound();
  }

  const game = getGame(state.gameId);
  const t = await getTranslations("match");
  const tGames = await getTranslations("games");

  const gameName = tGames.has(`${state.gameId}.name`)
    ? tGames(`${state.gameId}.name`)
    : (game?.displayName ?? state.gameId);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-[max(1.5rem,6vw)] py-[8vh]">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <p className="eyebrow">{gameName}</p>
          <h2 className="!mb-0">
            {t("title")} <span className="accent">{state.matchId}</span>
          </h2>
        </div>
        <Link href="/" className="nav-btn">
          {t("backToList")}
        </Link>
      </header>

      {game === null ? (
        <div className="card bad">
          <h3>{t("missingGameTitle")}</h3>
          <p>
            {t.rich("missingGameBody", {
              gameId: state.gameId,
              code: (chunks) => <code>{chunks}</code>,
            })}
          </p>
        </div>
      ) : (
        <MatchBoard initialState={state} />
      )}
    </main>
  );
}
