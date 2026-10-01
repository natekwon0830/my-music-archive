import { getLives } from "@/data/music";

export async function GET() {
  const lives = await getLives();

  return Response.json(lives, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}