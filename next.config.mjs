import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for better middleware support
  experimental: {
    serverComponentsExternalPackages: ["mongoose"],
  },

  // Disable font optimization in dev if DISABLE_FONT_OPTIMIZATION is set
  // This is useful for dev environments without internet access
  // Set DISABLE_FONT_OPTIMIZATION=true in .env.local for local dev
  optimizeFonts: process.env.DISABLE_FONT_OPTIMIZATION !== "true",

  // Exclude tmp_for_planning from page detection
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'].map(ext => {
    return ext;
  }),

  // Explicitly configure webpack to resolve path aliases
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
    };
    return config;
  },
};

export default nextConfig;
