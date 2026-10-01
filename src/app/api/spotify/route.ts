export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const albumName = searchParams.get("albumName") ?? "";
  const artistName = searchParams.get("artistName") ?? "";

  if (!albumName || !artistName) {
    return Response.json({ error: "albumName and artistName are required" }, { status: 400 });
  }

  const token = await getSpotifyToken();

  if (!token) {
    return Response.json({ error: "Spotify credentials are not configured" }, { status: 500 });
  }

  const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(`album:${albumName} artist:${artistName}`)}&type=album&limit=1`;
  const searchRes = await fetch(searchUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!searchRes.ok) {
    return Response.json({ error: "Spotify album search failed" }, { status: searchRes.status });
  }

  const searchData = await searchRes.json();
  const album = searchData.albums?.items?.[0];

  if (!album) {
    return Response.json({ error: "Album not found" }, { status: 404 });
  }

  const artistId = album.artists?.[0]?.id;
  let genres: string[] = [];

  if (artistId) {
    const artistRes = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (artistRes.ok) {
      const artistData = await artistRes.json();
      genres = artistData.genres ?? [];
    }
  }

  return Response.json({
    coverUrl: album.images?.[0]?.url ?? "",
    genres,
    spotifyUrl: album.external_urls?.spotify ?? "",
  });
}

async function getSpotifyToken() {
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
