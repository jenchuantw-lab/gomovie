import SearchPageClient from "./SearchPageClient";
import { getHotMovies } from "@/lib/supabase/queries";

export const metadata = {
  title: "搜尋電影 | GoMovie",
};

export default async function SearchPage() {
  const hotMovies = await getHotMovies(10).catch(() => []);
  return <SearchPageClient hotMovies={hotMovies} />;
}
