/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for better middleware support
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
};

export default nextConfig;
