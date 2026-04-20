import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { PWAProvider } from "@/components/PWAProvider";
import { ChatLayout } from "@/components/ChatLayout";

export const metadata: Metadata = {
  title: {
    default: "KOSE - Temukan Kost Terbaik & Terpercaya",
    template: "%s | KOSE",
  },
  description: "Platform pencarian kost terpercaya untuk mahasiswa dan masyarakat umum. Temukan kost impian di lokasi strategis dengan harga terjangkau. Gratis pasang kost.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KOSE",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "KOSE - Temukan Kost Terbaik & Terpercaya",
    description: "Platform pencarian kost terpercaya untuk mahasiswa dan masyarakat umum. Temukan kost impian di lokasi strategis.",
    type: "website",
    url: "https://kose.my.id",
    siteName: "KOSE",
    locale: "id_ID",
  },
  alternates: {
    canonical: "https://kose.my.id",
  },
  keywords: ["kost", "sewa kost", "kost murah", "kost terdekat", "kost mahasiswa"],
};

export const viewport: Viewport = {
  themeColor: "#011E55",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="antialiased">
        <Providers>
          <PWAProvider />
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#011E55] focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            Lewati ke konten utama
          </a>
          <main id="main-content">
            {children}
          </main>
          <ChatLayout />
        </Providers>
      </body>
    </html>
  );
}
