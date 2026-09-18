import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/volumes/creative-immersive/nemo-brand",
        destination: "/",
        permanent: true,
      },
      { source: "/volumes/:volume/:slug", destination: "/work/:slug", permanent: true },
      { source: "/creative/:slug", destination: "/work/:slug", permanent: true },
      { source: "/volumes", destination: "/", permanent: true },
      { source: "/gallery", destination: "/", permanent: true },
      { source: "/work", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
