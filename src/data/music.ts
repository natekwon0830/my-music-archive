export type AlbumEntry = {
  id: string;
  title: string;
  artist: string;
  genre: string;
  rating: number;
  review: string;
  coverUrl: string;
};

export type LiveEntry = {
  id: string;
  title: string;
  artist: string;
  videoId: string;
  rating: number;
  review: string;
};

export const albumSheetColumns = [
  "album_name",
  "artist_name",
  "genre",
  "rating",
  "review",
];

export const liveSheetColumns = [
  "youtube_video_id",
  "artist_name",
  "rating",
  "review",
];

const fallbackAlbums: AlbumEntry[] = [
  {
    id: "1",
    title: "OK Computer",
    artist: "Radiohead",
    genre: "Alternative Rock",
    rating: 9.5,
    review:
      "사랑과 불안이 동시에 흐르는 앨범. 중독적인 트랙들이 끝없이 반복되면서도 각 곡마다 인상이 남는다.",
    coverUrl:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "2",
    title: "Rough Trade",
    artist: "Mitski",
    genre: "Indie",
    rating: 9,
    review:
      "가볍지 않은 정서가 아주 섬세하게 표현된 작품. 목소리에 시선이 쏠릴 정도로 감정선이 강하다.",
    coverUrl:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "3",
    title: "Sleepless",
    artist: "Jazzyfact",
    genre: "R&B",
    rating: 8.5,
    review:
      "음색과 편곡의 균형이 좋아서 늘 듣는 중이다. 낮과 밤의 감정이 동시에 느껴진다.",
    coverUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80",
  },
];

const fallbackLives: LiveEntry[] = [
  {
    id: "1",
    title: "Tiny Desk Concert",
    artist: "Khruangbin",
    videoId: "dQw4w9WgXcQ",
    rating: 9,
    review: "공연 자체의 여유와 여운이 남는 라이브다. 음향이 특히 좋다.",
  },
  {
    id: "2",
    title: "Live at Primavera",
    artist: "Fontaines D.C.",
    videoId: "ScMzIvxBSi4",
    rating: 8.5,
    review: "압도적인 에너지와 분위기가 정말 좋았음. 무대에 대한 집중도가 높다.",
  },
  {
    id: "3",
    title: "Acoustic Session",
    artist: "Sufjan Stevens",
    videoId: "JGwWNGJdvx8",
    rating: 9.5,
    review: "어쿠스틱 버전에서 훨씬 더 감정이 선명하게 드러난다.",
  },
];

const albumSheetUrls = [
  process.env.GOOGLE_ALBUM_SHEET_CSV_URL,
  process.env.NEXT_PUBLIC_GOOGLE_ALBUM_SHEET_CSV_URL,
  process.env.GOOGLE_SHEET_CSV_URL,
  process.env.NEXT_PUBLIC_GOOGLE_SHEET_CSV_URL,
  "https://docs.google.com/spreadsheets/d/1oNrjOIPqVWUQnwYHhZyEWiqt3DC_OY6Y3GJsujCnGsA/export?format=csv",
].filter(Boolean) as string[];

const liveSheetUrls = [
  process.env.GOOGLE_LIVE_SHEET_CSV_URL,
  process.env.NEXT_PUBLIC_GOOGLE_LIVE_SHEET_CSV_URL,
  "https://docs.google.com/spreadsheets/d/1oNrjOIPqVWUQnwYHhZyEWiqt3DC_OY6Y3GJsujCnGsA/export?format=csv&gid=1578131437",
].filter(Boolean) as string[];

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (char === '"') {
      if (insideQuotes && text[i + 1] === '"') {
        cell += '"';
        i += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      row.push(cell.trim());
      cell = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && text[i + 1] === "\n") i += 1;
      row.push(cell.trim());
      if (row.some((value) => value.length > 0)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  row.push(cell.trim());
  if (row.some((value) => value.length > 0)) rows.push(row);
  return rows;
}

function normalizeRating(value: string): number {
  const parsed = Number(value.replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeYouTubeId(value: string): string {
  const raw = (value ?? "").trim().replace(/^['"]|['"]$/g, "");
  if (!raw) return "";

  if (/^[A-Za-z0-9_-]{11}$/.test(raw)) {
    return raw;
  }

  const candidate = raw.match(/https?:\/\/[^\s"')]+/i)?.[0] ?? raw;
  try {
    const url = new URL(candidate.startsWith("//") ? `https:${candidate}` : candidate.includes("://") ? candidate : `https://${candidate}`);
    const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
    let id = "";

    if (hostname === "youtu.be") {
      id = url.pathname.split("/").filter(Boolean)[0] ?? "";
    } else if (["youtube.com", "m.youtube.com", "music.youtube.com", "youtube-nocookie.com"].includes(hostname)) {
      id = url.searchParams.get("v") ??
        url.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/?]+)/i)?.[1] ??
        "";
    }

    return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : "";
  } catch {
    return "";
  }
}

async function getSpotifyToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return "";
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${auth}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    return "";
  }

  const data = await res.json();
  return data.access_token ?? "";
}

async function enrichAlbumWithSpotify(album: AlbumEntry): Promise<AlbumEntry> {
  const token = await getSpotifyToken();

  if (!token) {
    return album;
  }

  const query = encodeURIComponent(`album:${album.title} artist:${album.artist}`);
  const searchRes = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=album&limit=1`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 300 },
  });

  if (!searchRes.ok) {
    return album;
  }

  const searchData = await searchRes.json();
  const spotifyAlbum = searchData.albums?.items?.[0];

  if (!spotifyAlbum) {
    return album;
  }

  const artistId = spotifyAlbum.artists?.[0]?.id;
  let genres = album.genre ? [album.genre] : [];

  if (artistId) {
    const artistRes = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 300 },
    });

    if (artistRes.ok) {
      const artistData = await artistRes.json();
      if (artistData.genres?.length) {
        genres = artistData.genres;
      }
    }
  }

  return {
    ...album,
    coverUrl: spotifyAlbum.images?.[0]?.url ?? album.coverUrl,
    genre: genres[0] ?? album.genre ?? "Unknown",
  };
}

function toAlbum(row: string[], index: number): AlbumEntry | null {
  const [titleRaw, artistRaw, genreRaw, ratingRaw, reviewRaw] = row;
  const title = (titleRaw ?? "").trim();
  const artist = (artistRaw ?? "").trim();
  const genre = (genreRaw ?? "").trim();
  const rating = normalizeRating(ratingRaw ?? "0");
  const review = (reviewRaw ?? "").trim();

  if (!title || !artist) {
    return null;
  }

  return {
    id: `album-${index + 1}`,
    title,
    artist,
    genre: genre || "Unknown",
    rating,
    review: review || "아직 리뷰가 기록되지 않았습니다.",
    coverUrl:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800&q=80",
  };
}

const liveHeaderAliases = {
  video: ["youtube_video_id", "youtube_id", "video_id", "youtube_url", "video_url", "youtube_link", "video_link", "youtube_video", "youtube", "video", "link", "url", "유튜브링크", "유튜브_링크", "영상링크", "영상_링크", "영상id"],
  artist: ["artist_name", "artist", "performer", "band", "아티스트", "아티스트명"],
  title: ["live_title", "performance_title", "title", "name", "라이브명", "공연명"],
  rating: ["rating", "score", "rate", "평점"],
  review: ["review", "comment", "notes", "memo", "리뷰", "감상평"],
};

function normalizeHeader(value: string): string {
  return value.replace(/^\uFEFF/, "").toLowerCase().trim().replace(/[\s-]+/g, "_");
}

function hasLiveHeader(row: string[]): boolean {
  const normalized = row.map(normalizeHeader);
  return liveHeaderAliases.video.some((alias) => normalized.includes(alias)) ||
    liveHeaderAliases.artist.some((alias) => normalized.includes(alias));
}

function toLive(row: string[], index: number, headers: string[] = []): LiveEntry | null {
  const normalizedHeaders = headers.map(normalizeHeader);
  const valueFor = (aliases: string[], fallbackIndex: number): string => {
    const headerIndex = aliases.map((alias) => normalizedHeaders.indexOf(alias)).find((i) => i >= 0);
    return row[headerIndex ?? fallbackIndex] ?? "";
  };

  const videoIdRaw = valueFor(liveHeaderAliases.video, 0);
  const artistRaw = valueFor(liveHeaderAliases.artist, 1);
  const titleRaw = valueFor(liveHeaderAliases.title, -1);
  const ratingRaw = valueFor(liveHeaderAliases.rating, 2);
  const reviewRaw = valueFor(liveHeaderAliases.review, 3);
  const videoId = normalizeYouTubeId(videoIdRaw ?? "");
  const artist = (artistRaw ?? "").trim();
  const rating = normalizeRating(ratingRaw ?? "0");
  const review = (reviewRaw ?? "").trim();

  if (!videoId || (!artist && !titleRaw.trim())) {
    return null;
  }

  return {
    id: `live-${index + 1}`,
    title: titleRaw.trim() || `${artist} Live`,
    artist,
    videoId,
    rating,
    review: review || "아직 리뷰가 기록되지 않았습니다.",
  };
}

async function fetchCsvRows(url: string): Promise<string[][]> {
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Sheet fetch failed: ${response.status}`);
  }

  return parseCsv(await response.text());
}

async function fetchFirstAvailableRows(urls: string[]): Promise<string[][]> {
  for (const url of urls) {
    try {
      const rows = await fetchCsvRows(url);
      if (rows.length > 0) {
        return rows;
      }
    } catch {
      // Try the next configured sheet URL.
    }
  }

  return [];
}

function withoutHeaderRow(rows: string[][]): string[][] {
  const firstRow = rows[0]?.map((cell) => cell.toLowerCase().trim()) ?? [];
  const hasHeaderRow = firstRow.some((cell) =>
    ["album_name", "artist_name", "youtube_video_id", "genre"].includes(cell),
  );
  return hasHeaderRow ? rows.slice(1) : rows;
}

export async function getAlbums(): Promise<AlbumEntry[]> {
  const rows = withoutHeaderRow(await fetchFirstAvailableRows(albumSheetUrls));
  const albums = rows.map(toAlbum).filter((item): item is AlbumEntry => item !== null);
  return Promise.all((albums.length > 0 ? albums : fallbackAlbums).map(enrichAlbumWithSpotify));
}

export async function getLives(): Promise<LiveEntry[]> {
  const sourceRows = await fetchFirstAvailableRows(liveSheetUrls);
  if (sourceRows.length === 0) return fallbackLives;

  const headers = hasLiveHeader(sourceRows[0]) ? sourceRows[0] : [];
  const rows = headers.length > 0 ? sourceRows.slice(1) : sourceRows;
  const sheetLives = rows
    .map((row, index) => toLive(row, index, headers))
    .filter((item): item is LiveEntry => item !== null)
    .filter((item) => /^[A-Za-z0-9_-]{11}$/.test(item.videoId));
  return sheetLives;
}

export const albums = fallbackAlbums;
export const lives = fallbackLives;
