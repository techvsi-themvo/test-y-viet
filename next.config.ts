import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  api: {
    bodyParser: false,
  },
  images: {
    domains: ['i.ibb.co'],
  },
};

export default nextConfig;
