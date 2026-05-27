import { NextResponse } from "next/server";

import type { GameState } from "@game-engine/engine";

import {
  getMatchFilePath,
  isValidMatchId,
  readJsonFile,
} from "@/lib/file-io";

interface RouteParams {
  readonly params: Promise<{ readonly id: string }>;
}

export async function GET(_req: Request, { params }: RouteParams) {
  const { id } = await params;

  if (!isValidMatchId(id)) {
    return NextResponse.json(
      { error: "Invalid matchId." },
      { status: 400 },
    );
  }

  try {
    const state = await readJsonFile<GameState>(getMatchFilePath(id));
    return NextResponse.json(state);
  } catch {
    return NextResponse.json(
      { error: `Match ${id} not found.` },
      { status: 404 },
    );
  }
}
