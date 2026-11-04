import type { Metadata } from "next";
import { Syne, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "../portfolio/story.css";
import "../portfolio/lab-cursor.css";
import { SiteChrome } from "@/components/site-chrome";
import { Analytics } from "@vercel/analytics/next";
import { SITE_DESCRIPTION, SITE_OG_IMAGE, SITE_URL } from "@/lib/site-metadata";

const syne = Syne({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-syne",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Josh Cole",
  description: SITE_DESCRIPTION,
  openGraph: {
    title: "Josh Cole — Design, systems and experiments",
    description: SITE_DESCRIPTION,
    siteName: "Josh Cole",
    type: "website",
    images: [SITE_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Josh Cole — Design, systems and experiments",
    description: SITE_DESCRIPTION,
    images: [{url: SITE_OG_IMAGE.url, alt: SITE_OG_IMAGE.alt}],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      style={{backgroundColor:"#0b0d0c",colorScheme:"dark"}}
      className={`${syne.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-background text-foreground">
        {children}
        <SiteChrome />
        <Analytics />
      </body>
    </html>
  );
}
