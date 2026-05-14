import { NextRequest, NextResponse } from "next/server";
import { getMoviesByIds, getHotMovies } from "@/lib/supabase/queries";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // Hot movies
  if (searchParams.get("hot") === "true") {
    const data = await getHotMovies(10).catch(() => []);
    return NextResponse.json(data);
  }

  // By IDs
  const ids = searchParams.get("ids");
  if (!ids) return NextResponse.json([]);
  const idList = ids.split(",").filter(Boolean);
  const data = await getMoviesByIds(idList).catch(() => []);
  return NextResponse.json(data);
}
