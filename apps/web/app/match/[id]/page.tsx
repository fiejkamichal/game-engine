import Link from "next/link";
import { notFound } from "next/navigation";

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

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-[max(1.5rem,6vw)] py-[8vh]">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <p className="eyebrow">{game?.displayName ?? state.gameId}</p>
          <h2 className="!mb-0">
            Mecz <span className="accent">{state.matchId}</span>
          </h2>
        </div>
        <Link href="/" className="nav-btn">
          ← Lista gier
        </Link>
      </header>

      {game === null ? (
        <div className="card bad">
          <h3>Brak gry w rejestrze</h3>
          <p>
            Mecz wskazuje na grę <code>{state.gameId}</code>, której nie ma w
            rejestrze (<code>apps/web/lib/games-registry.ts</code>). Sprawdź,
            czy paczka <code>packages/games/{state.gameId}/</code> jest
            zarejestrowana.
          </p>
        </div>
      ) : (
        <MatchBoard initialState={state} />
      )}
    </main>
  );
}
