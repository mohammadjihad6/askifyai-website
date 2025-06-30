import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Cairo, Amiri, Tajawal } from 'next/font/google';
import "./globals.css";
import GoogleAnalytics from "./Analytics";

// --- Font Configuration ---
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cairo = Cairo({ subsets: ['arabic', 'latin'], variable: '--font-cairo', display: 'swap' });
const amiri = Amiri({ subsets: ['arabic'], variable: '--font-amiri', display: 'swap', weight: ['400', '700'] });
const tajawal = Tajawal({ subsets: ['arabic'], variable: '--font-tajawal', display: 'swap', weight: ['400', '700'] });

export const metadata: Metadata = {
  title: "AskifyAI - AI-Powered Career Tools",
  description: "Prepare for your dream job with AskifyAI. Get AI-powered CV analysis, personalized interview questions, coding challenges, and expert behavioral feedback.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "96x96" },
    ],
    apple: "/apple-icon.png",
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
      <body className={`${inter.variable} font-inter ${cairo.variable} ${amiri.variable} ${tajawal.variable} antialiased`}>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}