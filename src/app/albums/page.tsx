import Link from "next/link";
import { getAlbums } from "@/data/music";
import AlbumLibrary from "./AlbumLibrary";

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

      <AlbumLibrary initialAlbums={albums} />
    </main>
  );
}
