import Link from "next/link";

export default function EmptyWatchlist() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
      <svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1a1814"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-25 mb-4"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <p className="text-[16px] font-medium text-text-primary mb-2">
        還沒有收藏的電影
      </p>
      <p className="text-[13px] text-text-muted mb-6 leading-relaxed">
        搜尋喜歡的片名，點愛心加入收藏清單
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 bg-brand-red text-white rounded-full text-[14px] font-medium"
      >
        去搜尋電影
      </Link>
    </div>
  );
}
