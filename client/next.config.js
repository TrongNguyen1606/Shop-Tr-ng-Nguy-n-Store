/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${process.env.API_URL || 'http://localhost:5000'}/api/:path*` }];
  },
  images: {
    remotePatterns: [{ hostname: 'tr.rbxcdn.com' }, { hostname: '**.rbxcdn.com' }],
  },
};
module.exports = nextConfig;
