import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  }, // <-- ОБЯЗАТЕЛЬНО ПОСТАВЬ ЭТУ ЗАПЯТУЮ
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;