import { NextRequest, NextResponse } from "next/server";
import { searchMovies } from "@/lib/supabase/queries";

export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get("q");
  if (!q) return NextResponse.json([]);
  const data = await searchMovies(q).catch(() => []);
  return NextResponse.json(data);
}
