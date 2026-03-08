import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    qualities: [75, 85],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aniliberty.top',
      },
      {
        protocol: 'https',
        hostname: 'cdn.aniliberty.top',
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  async redirects() {
    return [
      {
        source: '/anime',
        destination: '/catalog',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
