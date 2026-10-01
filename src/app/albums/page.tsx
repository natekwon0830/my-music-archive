import Link from "next/link";
import { getAlbums } from "@/data/music";

export default async function AlbumsPage() {
  const albums = await getAlbums();

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-400">
            Collection
          </p>
          <h1 className="mt-2 text-4xl font-bold text-white">내가 들은 앨범</h1>
        </div>
        <Link
          href="/"
          className="rounded-full border border-white/15 bg-[#111111] px-4 py-2 text-sm text-white transition hover:bg-white hover:text-black"
        >
          홈으로
        </Link>
      </div>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {albums.map((album) => (
          <article
            key={album.id}
            className="overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-[0_0_25px_rgba(255,255,255,0.04)]"
          >
            <img
              src={album.coverUrl}
              alt={`${album.title} cover`}
              className="h-64 w-full object-cover"
            />
            <div className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-white">{album.title}</h2>
                  <p className="mt-1 text-sm text-zinc-300">{album.artist}</p>
                </div>
                <span className="rounded-full border border-white/10 bg-white px-2.5 py-1 text-sm font-semibold text-black">
                  ★ {album.rating.toFixed(1)}
                </span>
              </div>

              <div className="inline-flex rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-xs text-zinc-200">
                {album.genre}
              </div>

              <p className="text-sm leading-6 text-zinc-300">{album.review}</p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
