import type { NextConfig } from "next";

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Disables ESLint completely during build
  },
}

module.exports = nextConfig