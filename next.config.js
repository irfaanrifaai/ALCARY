/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com", // Google profile images
      "your-project-id.supabase.co", // Ganti dengan project ID Supabase Anda
      "via.placeholder.com", // Placeholder images
    ],
    // Atau gunakan remotePatterns untuk lebih secure (Next.js 13+)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

module.exports = nextConfig;
