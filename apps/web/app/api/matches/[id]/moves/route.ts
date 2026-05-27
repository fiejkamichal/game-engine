import { NextResponse } from "next/server";

import type { GameState, Move } from "@game-engine/engine";
import { applyMove } from "@game-engine/engine";

import {
  atomicWriteFile,
  getMatchFilePath,
  isValidMatchId,
  readJsonFile,
} from "@/lib/file-io";
import { getGame } from "@/lib/games-registry";

interface MoveRequestBody {
  readonly move?: unknown;
}

interface RouteParams {
  readonly params: Promise<{ readonly id: string }>;
}

function isMove(value: unknown): value is Move {
  return (
    typeof value === "object" &&
    value !== null &&
    "kind" in value &&
    typeof (value as { kind: unknown }).kind === "string"
  );
}

export async function POST(request: Request, { params }: RouteParams) {
  const { id } = await params;

  if (!isValidMatchId(id)) {
    return NextResponse.json(
      { error: "Invalid matchId." },
      { status: 400 },
    );
  }

  let body: MoveRequestBody;
  try {
    body = (await request.json()) as MoveRequestBody;
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  if (!isMove(body.move)) {
    return NextResponse.json(
      { error: "Missing or malformed `move` payload (needs string `kind`)." },
      { status: 400 },
    );
  }

  let state: GameState;
  try {
    state = await readJsonFile<GameState>(getMatchFilePath(id));
  } catch {
    return NextResponse.json(
      { error: `Match ${id} not found.` },
      { status: 404 },
    );
  }

  const game = getGame(state.gameId);
  if (game === null) {
    return NextResponse.json(
      { error: `Match references unknown gameId: ${state.gameId}` },
      { status: 500 },
    );
  }

  const result = applyMove(game, state, body.move);
  if (!result.ok) {
    const status =
      result.error.code === "match-finished"
        ? 409
        : result.error.code === "semantic"
          ? 422
          : 400;
    return NextResponse.json({ error: result.error }, { status });
  }

  await atomicWriteFile({
    filepath: getMatchFilePath(id),
    contents: `${JSON.stringify(result.state, null, 2)}\n`,
  });

  return NextResponse.json(result.state);
}
