/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // output: 'export',
  rewrites: () => [
    {
      "source": "/api",
      "destination": "http://139.177.202.65:6543"
    },
  ]
};

export default nextConfig;

