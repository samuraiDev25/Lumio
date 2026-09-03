import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  sassOptions: {
    includePaths: [path.join(process.cwd(), 'src')],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'test-bucket-lumio.storage.yandexcloud.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lumio-files-photo.storage.yandexcloud.net',
        pathname: '/**',
      },
    ],
  },
};
export default nextConfig;
