// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   experimental: {
//     disableStaticGeneration: true,
//   },
//   staticPageGenerationTimeout: 120,
// };

// module.exports = nextConfig;

module.exports = {
  output: "standalone",

  images: {
    unoptimized: true,
  },
};
