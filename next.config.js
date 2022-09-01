/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["ethereum-optimism.github.io", "docs.velodrome.finance"],
  },
};

module.exports = nextConfig;
