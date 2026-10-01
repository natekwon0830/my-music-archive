"use client";

import { useMemo, useState } from "react";
import type { LiveEntry } from "@/data/music";

export default function LiveLibrary({ lives }: { lives: LiveEntry[] }) {
  const [ratingSort, setRatingSort] = useState("none");

  const sortedLives = useMemo(() => {
    const sorted = [...lives];
    if (ratingSort === "ascending") sorted.sort((a, b) => a.rating - b.rating);
    if (ratingSort === "descending") sorted.sort((a, b) => b.rating - a.rating);
    return sorted;
  }, [lives, ratingSort]);

  if (lives.length === 0) {
    return (
      <section className="rounded-2xl border border-white/10 bg-[#111111] p-8 text-zinc-300">
        <h2 className="text-lg font-semibold text-white">표시할 수 있는 라이브가 없습니다</h2>
        <p className="mt-2 text-sm leading-6">
          시트의 영상 열에 YouTube 영상 ID 또는 youtube.com/watch, youtu.be, /shorts/, /embed/, /live/ 링크를 입력했는지 확인해 주세요.
          영상 ID는 11자리여야 합니다.
        </p>
      </section>
    );
  }

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-400">{sortedLives.length}개 라이브</p>
        <label className="text-sm text-zinc-300">
          평점 정렬
          <select
            value={ratingSort}
            onChange={(event) => setRatingSort(event.target.value)}
            className="ml-3 rounded-xl border border-white/15 bg-[#111111] px-4 py-2.5 text-white outline-none focus:border-white/50"
          >
            <option value="none">기본 순서</option>
            <option value="ascending">낮은 평점순</option>
            <option value="descending">높은 평점순</option>
          </select>
        </label>
      </div>

      <section className="grid gap-5 sm:grid-cols-2">
        {sortedLives.map((live) => (
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
                <h2 className="text-xl font-semibold text-white">{live.artist}</h2>
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
    </>
  );
}