/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@modelcard/schema'],
  output: 'standalone',
}

module.exports = nextConfig
