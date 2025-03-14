import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['image.tmdb.org'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3333/api/:path*',
      },
    ]
  },
};



export default nextConfig;
