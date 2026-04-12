import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies, headers } from "next/headers";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read theme cookie server-side to avoid flash of wrong theme
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("samaa-theme")?.value;
  const initialTheme: "light" | "dark" =
    themeCookie === "light" ? "light" : "dark";

  // next-intl middleware sets x-next-intl-locale on the request
  const headersList = await headers();
  const locale = headersList.get("x-next-intl-locale") ?? "fr";
  const dir = locale === "ary" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${geistSans.variable} ${geistMono.variable} ${initialTheme}`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        <ThemeProvider initialTheme={initialTheme}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
