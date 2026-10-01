import Link from "next/link";
import { albumSheetColumns, getAlbums, getLives, liveSheetColumns } from "@/data/music";

export default async function Home() {
  const albums = await getAlbums();
  const lives = await getLives();

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12">
      <section className="rounded-3xl border border-white/10 bg-[#111111] p-8 shadow-[0_0_30px_rgba(255,255,255,0.04)] md:p-12">
        <div className="mb-6 flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-zinc-300">
          <span className="h-2.5 w-2.5 rounded-full bg-white" />
          Music Archive
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.6fr_0.9fr]">
          <div>
            <h1 className="max-w-xl text-4xl font-black tracking-tight text-white md:text-6xl">
              내가 들은 음악을 한 번에 보여주는 아카이브
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-300">
              앨범과 라이브를 한곳에서 정리하고, 스포티파이와 유튜브의 데이터와 내 감상을 함께 남깁니다.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/albums"
                className="rounded-full bg-white px-5 py-3 font-semibold text-black transition hover:bg-zinc-200"
              >
                앨범 보기
              </Link>
              <Link
                href="/lives"
                className="rounded-full border border-white/20 bg-transparent px-5 py-3 font-semibold text-white transition hover:bg-white/5"
              >
                라이브 보기
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0d0d0d] p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">
              입력 방식
            </p>
            <ul className="mt-4 space-y-4 text-sm text-zinc-200">
              <li>
                <span className="font-medium text-white">앨범</span>
                <div className="mt-1 text-zinc-300">{albumSheetColumns.join(" / ")}</div>
              </li>
              <li>
                <span className="font-medium text-white">라이브</span>
                <div className="mt-1 text-zinc-300">{liveSheetColumns.join(" / ")}</div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Link
          href="/albums"
          className="rounded-2xl border border-white/10 bg-[#111111] p-6 transition hover:border-white/30 hover:bg-[#171717]"
        >
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-300">Album</p>
          <h2 className="mt-3 text-3xl font-bold text-white">내가 들은 앨범</h2>
          <p className="mt-3 text-zinc-300">
            현재 {albums.length}개 앨범이 등록되어 있습니다.
          </p>
        </Link>

        <Link
          href="/lives"
          className="rounded-2xl border border-white/10 bg-[#111111] p-6 transition hover:border-white/30 hover:bg-[#171717]"
        >
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-300">Live</p>
          <h2 className="mt-3 text-3xl font-bold text-white">내가 들은 라이브</h2>
          <p className="mt-3 text-zinc-300">
            현재 {lives.length}개 라이브가 등록되어 있습니다.
          </p>
        </Link>
      </section>
    </main>
  );
}
