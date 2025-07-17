// next.config.js
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.suitdev.com',
      },
      {
        protocol: 'https',
        hostname: 'image.shutterstock.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/ideas',
        destination: 'https://suitmedia-backend.suitdev.com/api/ideas',
      },
    ];
  },
};

export default nextConfig;
