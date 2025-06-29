import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AskifyAI",
  description:
    "Prepare for your dream job with AskifyAI. Get AI-powered CV analysis, personalized interview questions, coding challenges, and expert behavioral feedback. Ace your next role!",
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon", sizes: "32x32" },
      { url: "/apple-icon.png", type: "image/png", sizes: "180x180" },
      { url: "/icon1.png", type: "image/png", sizes: "96x96" },
      { url: "/icon0.png", type: "image/png", sizes: "any" },
      { url: "/web-app-manifest-192.png", type: "image/png", sizes: "192x192" },
      { url: "/web-app-manifest-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/apple-icon.png", // يدعم أجهزة Apple
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
