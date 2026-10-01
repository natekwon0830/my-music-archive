import Link from "next/link";
import { getLives } from "@/data/music";
import RefreshLivesButton from "./RefreshLivesButton";

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

      {lives.length === 0 ? (
        <section className="rounded-2xl border border-white/10 bg-[#111111] p-8 text-zinc-300">
          <h2 className="text-lg font-semibold text-white">표시할 수 있는 라이브가 없습니다</h2>
          <p className="mt-2 text-sm leading-6">
            시트의 영상 열에 YouTube 영상 ID 또는 youtube.com/watch, youtu.be, /shorts/, /embed/, /live/ 링크를 입력했는지 확인해 주세요.
            영상 ID는 11자리여야 합니다.
          </p>
        </section>
      ) : (
      <section className="grid gap-5 sm:grid-cols-2">
        {lives.map((live) => (
          <article
            key={live.id}
            className="overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-[0_0_25px_rgba(255,255,255,0.04)]"
          >
            <div className="aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${live.videoId}`}
                title={`${live.artist} 공연 영상`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="h-full w-full"
              />
            </div>

            <div className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">{live.artist}</h2>
                </div>
                <span className="rounded-full border border-white/10 bg-white px-2.5 py-1 text-sm font-semibold text-black">
                  ★ {live.rating.toFixed(1)}
                </span>
              </div>

              <p className="text-sm leading-6 text-zinc-300">{live.review}</p>
              <a
                href={`https://www.youtube.com/watch?v=${live.videoId}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex text-sm font-medium text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
              >
                YouTube에서 보기 ↗
              </a>
            </div>
          </article>
        ))}
      </section>
      )}
    </main>
  );
}
