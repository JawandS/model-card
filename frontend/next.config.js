/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@modelcard/schema'],
  experimental: {
    // Enable optimizations
  },
}

module.exports = nextConfig
