/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    // TODO: Fix ESLint errors and remove this configuration to enable linting during builds
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize better-sqlite3 for server-side bundling
      config.externals.push({
        'better-sqlite3': 'commonjs better-sqlite3'
      });
    }
    return config;
  },
  // Skip database initialization during Vercel build
  env: {
    SKIP_DATABASE_INIT: process.env.VERCEL ? 'true' : (process.env.SKIP_DATABASE_INIT || 'false')
  },
}

module.exports = nextConfig
