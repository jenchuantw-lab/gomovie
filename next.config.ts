import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
      {
        protocol: "https",
        hostname: "assets.showtimes.com.tw",
      },
      {
        protocol: "https",
        hostname: "www.ambassador.com.tw",
      },
      {
        protocol: "https",
        hostname: "pic.skcinemas.com",
      },
    ],
  },
};

export default nextConfig;
