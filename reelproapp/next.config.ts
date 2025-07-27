// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['mongoose', 'bcryptjs'],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
      },
      {
        protocol: "https", 
        hostname: "avatars.githubusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", 
        port: "",
      }
    ]
  },
  // ✅ CSS optimization settings
  swcMinify: true,
  compiler: {
    removeConsole: false, // Keep console logs for debugging
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;