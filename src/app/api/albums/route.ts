import { getAlbums } from "@/data/music";

export async function GET() {
  const albums = await getAlbums();

  return Response.json(albums, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}