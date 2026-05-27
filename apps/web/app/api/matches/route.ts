import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { createInitialState } from "@game-engine/engine";

import {
  atomicWriteFile,
  getMatchFilePath,
} from "@/lib/file-io";
import { getGame } from "@/lib/games-registry";

interface CreateMatchBody {
  readonly gameId?: unknown;
}

export async function POST(request: Request) {
  let body: CreateMatchBody;
  try {
    body = (await request.json()) as CreateMatchBody;
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  if (typeof body.gameId !== "string" || body.gameId.length === 0) {
    return NextResponse.json(
      { error: "`gameId` is required (string)." },
      { status: 400 },
    );
  }

  const game = getGame(body.gameId);
  if (game === null) {
    return NextResponse.json(
      { error: `Unknown gameId: ${body.gameId}` },
      { status: 404 },
    );
  }

  const matchId = `${game.id}-${randomUUID().slice(0, 8)}`;
  const initialState = createInitialState(game, matchId);

  await atomicWriteFile({
    filepath: getMatchFilePath(matchId),
    contents: `${JSON.stringify(initialState, null, 2)}\n`,
  });

  return NextResponse.json(initialState, { status: 201 });
}
