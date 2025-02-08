import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["api.expolis.cloud"], // ✅ ここに外部画像のドメインを追加
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ build 時の ESLint エラーを無視
  },
};

export default nextConfig;
