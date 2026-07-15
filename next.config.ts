import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/all-trips",
        destination: "/destinations",
        permanent: true,
      },
    ];
  },
  // Allow the LAN IP shown by `next dev` (Network: http://10.0.0.37:3000) so
  // Turbopack/HMR and /_next dev assets aren't blocked as cross-origin. Update
  // the IP if your machine's address changes on the network.
  allowedDevOrigins: ["10.0.0.37"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
