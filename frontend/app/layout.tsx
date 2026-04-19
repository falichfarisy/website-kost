import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { PWAProvider } from "@/components/PWAProvider";
import { ChatLayout } from "@/components/ChatLayout";

export const metadata: Metadata = {
  title: "KOSE - Temukan Kost Terbaik",
  description: "Platform pencarian kost untuk mahasiswa dan masyarakat umum. Temukan hunian terbaik dengan mudah dan cepat.",
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
    title: "KOSE - Temukan Kost Terbaik",
    description: "Platform pencarian kost untuk mahasiswa dan masyarakat umum",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#011E55",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
          {children}
          <ChatLayout />
        </Providers>
      </body>
    </html>
  );
}
