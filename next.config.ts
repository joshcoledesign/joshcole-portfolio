import type { NextConfig } from "next";
import portfolioRoutes from "./src/portfolio/routes.json";

const nextConfig: NextConfig = {
  devIndicators: false,
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", has: [{type:"query",key:"tag"}], destination: "/archive" },
        ...portfolioRoutes.map((route) => ({
          source: route.path,
          destination: `/portfolio/${route.view}`,
          ...(route.path === "/" ? {missing:[{type:"query" as const,key:"tag"}]} : {}),
        })),
      ],
      afterFiles: [],
      fallback: [],
    };
  },
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
