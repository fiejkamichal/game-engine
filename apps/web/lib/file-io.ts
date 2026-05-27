/**
 * File I/O helpers for match-state persistence.
 *
 * `data/matches/{matchId}.json` is the single source of truth for an
 * in-progress or finished match (D7). Writes are atomic (D8): write to a
 * `.tmp` sibling, then `rename`. Reads validate `matchId` shape to keep the
 * routes from accepting `..` traversal.
 *
 * `process.cwd()` is `apps/web/` when started via the root `npm run dev`
 * script (which uses `--workspace=@game-engine/web`); the `../../data`
 * relative path anchors back to the repo root.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

const MATCHES_DIR = path.resolve(
  process.cwd(),
  "..",
  "..",
  "data",
  "matches",
);

const MATCH_ID_PATTERN = /^[a-zA-Z0-9_-]{1,64}$/;

export function isValidMatchId(matchId: string): boolean {
  return MATCH_ID_PATTERN.test(matchId);
}

export function getMatchFilePath(matchId: string): string {
  if (!isValidMatchId(matchId)) {
    throw new Error(`Invalid matchId: ${matchId}`);
  }
  return path.join(MATCHES_DIR, `${matchId}.json`);
}

export interface AtomicWriteOptions {
  readonly filepath: string;
  readonly contents: string;
}

export async function atomicWriteFile({
  filepath,
  contents,
}: AtomicWriteOptions): Promise<void> {
  const dir = path.dirname(filepath);
  await fs.mkdir(dir, { recursive: true });
  const tempPath = `${filepath}.${randomUUID()}.tmp`;
  await fs.writeFile(tempPath, contents, { encoding: "utf8" });
  await fs.rename(tempPath, filepath);
}

export async function readJsonFile<T>(filepath: string): Promise<T> {
  const raw = await fs.readFile(filepath, "utf8");
  return JSON.parse(raw) as T;
}
