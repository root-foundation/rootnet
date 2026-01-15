import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

import { SITE_URL } from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "rootnet",
    template: "%s · rootnet",
  },
  openGraph: {
    type: "website",
    siteName: "rootnet",
    title: "rootnet",
    images: [
      {
        url: "/social.png",
        width: 1200,
        height: 630,
        alt: "rootnet",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "rootnet",
    images: ["/social.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
