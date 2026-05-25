export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12">
      <div className="max-w-2xl space-y-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
          AI Generation in practice
        </p>
        <h1 className="text-5xl font-bold tracking-tight text-neutral-50">
          Workshop bootstrap
        </h1>
        <p className="text-lg text-neutral-300">
          Turn-based game engine. One engine, two reference games (tic-tac-toe,
          checkers), four agent roles, one codebase.
        </p>
        <p className="text-sm text-neutral-500">
          This page is intentionally minimal. Real UI lands in iteration 6
          (engine + tic-tac-toe end-to-end). Until then —{" "}
          <code className="rounded bg-neutral-900 px-1.5 py-0.5 text-neutral-200">
            npm run dev
          </code>{" "}
          works and that is the point.
        </p>
      </div>
    </main>
  );
}
