/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        "zlib-sync": require.resolve('browserify-zlib'),
      }
    };
    return config;
  },
};

module.exports = nextConfig;
