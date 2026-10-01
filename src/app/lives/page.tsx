import Link from "next/link";
import { getLives } from "@/data/music";
import RefreshLivesButton from "./RefreshLivesButton";
import LiveLibrary from "./LiveLibrary";

export default async function LivesPage() {
  const lives = await getLives();

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-400">
            Live Archive
          </p>
          <h1 className="mt-2 text-4xl font-bold text-white">내가 들은 라이브</h1>
        </div>
        <div className="flex items-center gap-2">
          <RefreshLivesButton lives={lives} />
          <Link
            href="/"
            className="rounded-full border border-white/15 bg-[#111111] px-4 py-2 text-sm text-white transition hover:bg-white hover:text-black"
          >
            홈으로
          </Link>
        </div>
      </div>

      <LiveLibrary lives={lives} />
    </main>
  );
}
