/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // TODO: change this back to true once https://github.com/swc-project/swc/issues/5935 is merged
  swcMinify: false,
  experimental: {
    swcPlugins: [
      ['next-superjson-plugin', {}],
    ],
  },
}

module.exports = nextConfig
