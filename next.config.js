/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
  reactStrictMode: true,
  ...(isGithubPages ? {
    output: 'export',
    basePath: '/Frontend-',
    trailingSlash: true,
    images: { unoptimized: true },
  } : {}),
  ...(!isGithubPages ? {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/:path*`,
        },
      ];
    },
  } : {}),
};
module.exports = nextConfig;
