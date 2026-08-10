import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serve the standalone resume document (public/resume.html) at a clean /resume URL.
  // It is a self-contained, print-oriented artifact — intentionally kept outside the
  // App Router so it renders without the site's root layout, nav, and footer chrome.
  async rewrites() {
    return [{ source: "/resume", destination: "/resume.html" }];
  },
};

export default nextConfig;
