// Traditional Chinese genre mapping + curated list + special event detection
export const GENRE_ZH: Record<string, string> = {
  Action: "動作", Adventure: "冒險", Animation: "動畫", Comedy: "喜劇",
  Crime: "犯罪", Documentary: "紀錄片", Drama: "劇情", Family: "家庭",
  Fantasy: "奇幻", History: "歷史", Horror: "恐怖", Music: "音樂",
  Mystery: "懸疑", Romance: "愛情", "Science Fiction": "科幻",
  Thriller: "驚悚", War: "戰爭", Western: "西部",
};

export const CURATED_GENRES = ["動作", "喜劇", "恐怖", "科幻", "動畫", "愛情", "劇情", "驚悚", "奇幻", "紀錄片", "特別場次"];

const SPECIAL_KEYWORDS = ["演唱會", "音樂會", "粉絲見面", "LIVE", "巡迴", "展演", "直播", "特映", "VIEWING", "TOUR", "CONCERT", "FANMEETING"];

export function toZhGenre(g: string): string {
  return GENRE_ZH[g] ?? g;
}

export function isSpecialEvent(titleZh: string): boolean {
  const upper = titleZh.toUpperCase();
  return SPECIAL_KEYWORDS.some(kw => upper.includes(kw.toUpperCase()));
}
