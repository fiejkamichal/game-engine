# file-io-safety

Skill for the Backend Developer. Covers atomic JSON writes, safe path
construction (anti-traversal), and schema-checked reads. Applies any time
a file is the source of truth for state.

## When to use

- You are about to call `fs.writeFile` with state that survives a
  process restart.
- You receive a path component from outside (URL parameter, JSON field,
  filename argument) and are about to join it into a file path.
- You are reading back data you previously wrote and want a defined
  behavior if the schema has drifted.

## Procedure

### 1. Write atomically: `*.tmp` then `rename`

A naive `writeFile(finalPath, …)` can leave a half-written file if the
process dies mid-flush. `rename` is atomic on POSIX and on Windows for
same-volume targets, so:

```ts
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

export async function atomicWriteFile({
  filepath,
  contents,
}: {
  readonly filepath: string;
  readonly contents: string;
}): Promise<void> {
  const dir = path.dirname(filepath);
  await fs.mkdir(dir, { recursive: true });
  const tempPath = `${filepath}.${randomUUID()}.tmp`;
  await fs.writeFile(tempPath, contents, { encoding: "utf8" });
  await fs.rename(tempPath, filepath);
}
```

Append a UUID to the `.tmp` name so two concurrent writers don't clobber
each other's temp file.

### 2. Validate any path component coming from outside

For this repo, `matchId` is the variable component of
`data/matches/{matchId}.json` and arrives in URL params. Reject anything
that does not match a strict allow-list before touching the filesystem.

```ts
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
```

Allow-list, not deny-list. Banning `..` while accepting `~/` or
`\\server\share` is the classic mistake.

### 3. Anchor your data directory deterministically

Don't sprinkle `process.cwd()` across the code; resolve once near the
module top. In this repo `apps/web/lib/file-io.ts` anchors with:

```ts
const MATCHES_DIR = path.resolve(
  process.cwd(),
  "..",
  "..",
  "data",
  "matches",
);
```

Document the assumption (here: the dev server is started via the root
`npm run dev` script, which sets `cwd` to `apps/web/`).

### 4. Version the schema; reject unknown versions on read

Anything that hits disk gets a literal `schemaVersion: 1` field
(see [`define-typescript-contract.md`](./define-typescript-contract.md)
step 6). On read:

```ts
const raw = await readJsonFile<{ schemaVersion: number }>(filepath);
if (raw.schemaVersion !== 1) {
  throw new Error(`Unsupported schemaVersion: ${raw.schemaVersion}`);
}
```

When the schema breaks, bump the version and add a migration ADR. Never
silently coerce older shapes.

### 5. Treat the filesystem as eventually-consistent on Windows

If a writer immediately reads what it just renamed, on some Windows
configurations the `rename` is visible to the writer's own handle but not
yet to a separate handle. In a request/response system that round-trips
through the disk this is rare but real — keep the read and write in the
same async chain when latency matters.

## Code example

The full implementation lives in
[`apps/web/lib/file-io.ts`](../apps/web/lib/file-io.ts):

- `atomicWriteFile` — `*.tmp.<uuid>` + `rename`, `recursive: true` mkdir.
- `isValidMatchId` — allow-list regex.
- `getMatchFilePath` — refuses invalid match IDs *before* the join.
- `readJsonFile` — typed read helper, parses JSON.

Used by every write/read path in `apps/web/app/api/matches/`.

## Anti-patterns

- **`writeFile(path, contents)` then "hope for the best"** — a Ctrl-C
  mid-flush corrupts the file. Always go through `.tmp` + rename.
- **`path.join(MATCHES_DIR, untrustedInput)` without validation** —
  `..%2F..%2Fetc%2Fpasswd` is a thing. Allow-list first.
- **Reading without checking `schemaVersion`** — a stale match file
  silently misinterpreted produces hours of confusion. One `if` saves
  it.
- **Computing the data directory on every call** — anchors should be
  module-level constants; cheaper and easier to audit.
- **Catching the rename error and writing again** — usually papers over
  the actual problem (permissions, device full). Let it bubble.
