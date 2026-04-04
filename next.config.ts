import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d36fypkbmmogz6.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
