/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    disableStaticGeneration: true,
  },
  staticPageGenerationTimeout: 120,
};

module.exports = nextConfig;
