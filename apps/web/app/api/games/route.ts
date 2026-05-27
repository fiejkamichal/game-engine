import { NextResponse } from "next/server";

import { listGames } from "@/lib/games-registry";

export async function GET() {
  return NextResponse.json({ games: listGames() });
}
