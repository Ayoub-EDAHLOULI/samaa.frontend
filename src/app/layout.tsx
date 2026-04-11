import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
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
  title: "Samaa — Identify Any Quran Reciter Instantly",
  description:
    "Samaa (سماع) is the Shazam for Quran. Record any recitation and discover the reciter in seconds using AI-powered voice recognition.",
  keywords: ["Quran", "reciter", "Qari", "Islamic app", "audio recognition", "Samaa", "سماع"],
  authors: [{ name: "Samaa" }],
  openGraph: {
    title: "Samaa — Identify Any Quran Reciter Instantly",
    description:
      "Record any Quran recitation and discover the Qari in seconds with AI-powered recognition.",
    type: "website",
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
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
