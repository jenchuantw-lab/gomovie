import { NextRequest, NextResponse } from "next/server";
import { getShowtimes } from "@/lib/supabase/queries";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const movieId = searchParams.get("movieId");
  const date = searchParams.get("date");

  if (!movieId || !date) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const data = await getShowtimes(movieId, date).catch(() => []);
  return NextResponse.json(data);
}
