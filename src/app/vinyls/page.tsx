import Link from "next/link";
import { getVinylRecords } from "@/data/music";

export default async function VinylsPage() {
  const records = await getVinylRecords();

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-6xl flex-col px-6 py-12">
      <div className="mb-10 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-400">
            Vinyl Collection
          </p>
          <h1 className="mt-2 text-4xl font-bold text-white">보유 LP 목록</h1>
        </div>
        <Link
          href="/"
          className="rounded-full border border-white/15 bg-[#111111] px-4 py-2 text-sm text-white transition hover:bg-white hover:text-black"
        >
          홈으로
        </Link>
      </div>

      {records.length === 0 ? (
        <section className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#111111] px-6 py-16 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-white/15 text-2xl text-zinc-300" aria-hidden="true">
            LP
          </div>
          <h2 className="text-2xl font-semibold text-white">아직 등록된 LP가 없습니다</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-zinc-400">
            시트에 앨범 이름과 아티스트를 입력하면 이곳에 컬렉션으로 표시됩니다.
          </p>
        </section>
      ) : (
        <>
          <p className="mb-5 text-sm text-zinc-400">총 {records.length}장</p>
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {records.map((record) => (
              <article
                key={record.id}
                className="rounded-2xl border border-white/10 bg-[#111111] p-6 shadow-[0_0_25px_rgba(255,255,255,0.04)]"
              >
                <div className="mb-6 flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-[#080808]">
                  <div className="relative flex h-4/5 aspect-square items-center justify-center rounded-full border border-white/20 bg-[repeating-radial-gradient(circle,#171717_0,#171717_2px,#0b0b0b_3px,#0b0b0b_5px)]">
                    {record.coverUrl ? (
                      <img
                        src={record.coverUrl}
                        alt={`${record.title} album cover`}
                        loading="lazy"
                        className="h-1/3 w-1/3 rounded-full border border-white/30 object-cover"
                      />
                    ) : (
                      <div className="h-1/3 w-1/3 rounded-full border border-white/20 bg-[#111111]" aria-hidden="true" />
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{record.title}</h2>
                    <p className="mt-1 text-sm text-zinc-300">{record.artist}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-300">
                    {record.genre && (
                      <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1.5">
                        {record.genre}
                      </span>
                    )}
                    {record.year && (
                      <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1.5">
                        {record.year}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </section>
        </>
      )}
    </main>
  );
}