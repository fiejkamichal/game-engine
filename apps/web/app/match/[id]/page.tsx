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
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-8 px-6 py-12">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
            {game?.displayName ?? state.gameId}
          </p>
          <h1 className="font-mono text-lg text-neutral-200">{state.matchId}</h1>
        </div>
        <Link
          href="/"
          className="text-sm text-neutral-400 underline-offset-4 hover:underline"
        >
          ← Lista gier
        </Link>
      </header>

      {game === null ? (
        <div className="rounded-lg border border-red-900 bg-red-950/40 p-6 text-sm text-red-200">
          Mecz wskazuje na grę <code>{state.gameId}</code>, której nie ma w
          rejestrze (<code>apps/web/lib/games-registry.ts</code>). Sprawdź, czy
          paczka <code>packages/games/{state.gameId}/</code> jest
          zarejestrowana.
        </div>
      ) : (
        <MatchBoard initialState={state} />
      )}
    </main>
  );
}
