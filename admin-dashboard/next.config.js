/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone', // Required for Docker builds
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'server', // Docker service name
        port: '5000',
        pathname: '/uploads/**',
      },
    ],
  },
  experimental: {
    appDir: false,
  },
  i18n: {
    locales: ['ar'],
    defaultLocale: 'ar',
  },
  env: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://server:5000/api',
  },
}

module.exports = nextConfig