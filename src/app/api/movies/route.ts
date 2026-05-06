import { NextRequest, NextResponse } from "next/server";
import { getMoviesByIds } from "@/lib/supabase/queries";

export async function GET(req: NextRequest) {
  const ids = new URL(req.url).searchParams.get("ids");
  if (!ids) return NextResponse.json([]);
  const idList = ids.split(",").filter(Boolean);
  const data = await getMoviesByIds(idList).catch(() => []);
  return NextResponse.json(data);
}
