"use client";

import { useEffect, useMemo, useState } from "react";
import type { AlbumEntry } from "@/data/music";

export default function AlbumLibrary({ initialAlbums }: { initialAlbums: AlbumEntry[] }) {
  const [albums, setAlbums] = useState(initialAlbums);
  const [artistQuery, setArtistQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [ratingSort, setRatingSort] = useState("none");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    setAlbums(initialAlbums);
  }, [initialAlbums]);

  const genres = useMemo(
    () => [...new Set(albums.map((album) => album.genre.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [albums],
  );

  const filteredAlbums = useMemo(() => {
    const normalizedArtist = artistQuery.trim().toLocaleLowerCase();
    const filtered = albums.filter((album) => {
      const matchesArtist = album.artist.toLocaleLowerCase().includes(normalizedArtist);
      const matchesGenre = !selectedGenre || album.genre.toLocaleLowerCase() === selectedGenre.toLocaleLowerCase();
      return matchesArtist && matchesGenre;
    });
    if (ratingSort === "ascending") filtered.sort((a, b) => a.rating - b.rating);
    if (ratingSort === "descending") filtered.sort((a, b) => b.rating - a.rating);
    return filtered;
  }, [albums, artistQuery, selectedGenre, ratingSort]);

  async function refreshAlbums() {
    setIsRefreshing(true);
    setStatus("");

    try {
      const response = await fetch("/api/albums", { cache: "no-store" });
      if (!response.ok) throw new Error("앨범 데이터를 가져오지 못했습니다.");

      const latestAlbums: AlbumEntry[] = await response.json();
      const hasChanges = JSON.stringify(albums) !== JSON.stringify(latestAlbums);
      setAlbums(latestAlbums);
      setStatus(hasChanges ? "변경사항을 반영했습니다." : "새로운 변경사항이 없습니다.");
    } catch {
      setStatus("확인에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsRefreshing(false);
    }
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#111111] p-4 sm:flex-row sm:items-end">
        <label className="flex-1 text-sm text-zinc-300">
          아티스트 검색
          <input
            type="search"
            value={artistQuery}
            onChange={(event) => setArtistQuery(event.target.value)}
            placeholder="아티스트 이름 입력"
            className="mt-2 w-full rounded-xl border border-white/15 bg-black px-4 py-3 text-white outline-none placeholder:text-zinc-500 focus:border-white/50"
          />
        </label>
        <label className="w-full text-sm text-zinc-300 sm:w-56">
          장르
          <select
            value={selectedGenre}
            onChange={(event) => setSelectedGenre(event.target.value)}
            className="mt-2 w-full rounded-xl border border-white/15 bg-black px-4 py-3 text-white outline-none focus:border-white/50"
          >
            <option value="">모든 장르</option>
            {genres.map((genre) => <option key={genre} value={genre}>{genre}</option>)}
          </select>
        </label>
        <label className="w-full text-sm text-zinc-300 sm:w-52">
          평점 정렬
          <select
            value={ratingSort}
            onChange={(event) => setRatingSort(event.target.value)}
            className="mt-2 w-full rounded-xl border border-white/15 bg-black px-4 py-3 text-white outline-none focus:border-white/50"
          >
            <option value="none">기본 순서</option>
            <option value="ascending">낮은 평점순</option>
            <option value="descending">높은 평점순</option>
          </select>
        </label>
        <div className="flex flex-col items-start gap-1 sm:items-end">
          <button
            type="button"
            onClick={() => void refreshAlbums()}
            disabled={isRefreshing}
            className="rounded-full border border-white/20 bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-wait disabled:opacity-60"
          >
            {isRefreshing ? "시트 확인 중…" : "↻ 새로고침"}
          </button>
          <span role="status" aria-live="polite" className="min-h-4 text-xs text-zinc-400">{status}</span>
        </div>
      </div>

      <p className="mb-4 text-sm text-zinc-400">{filteredAlbums.length} / {albums.length}개 앨범</p>
      {filteredAlbums.length === 0 ? (
        <section className="rounded-2xl border border-white/10 bg-[#111111] p-8 text-zinc-300">
          검색 조건에 맞는 앨범이 없습니다.
        </section>
      ) : (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredAlbums.map((album) => (
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
      )}
    </>
  );
}
