import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
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
    ],
  },
};
export default nextConfig;
