import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io", // Allow images from utfs.io
      },
    ],
  },
};

export default nextConfig;
