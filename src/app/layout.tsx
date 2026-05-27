import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import SignButton from "@/components/SignButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Repository Dashboard",
  description: "Repository statistics with sessions, slices, and activity.",
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
        <Providers>
          <header
            className="sticky top-0 z-50 bg-white/80 px-4 py-4 backdrop-blur-sm sm:px-8 dark:bg-black/70"
            aria-label="Main navigation"
          >
            <div className=" flex w-full items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <Link
                  href="/"
                  className="text-lg font-semibold tracking-tight"
                  aria-label="Go to repositories dashboard"
                >
                  anz
                </Link>
                <nav
                  aria-label="Primary"
                  className="flex items-center gap-1 rounded-full bg-zinc-100/80 p-1 text-sm text-zinc-700 shadow-sm shadow-black/5 dark:bg-zinc-900/70 dark:text-zinc-200"
                >
                  <Link
                    href="/landing"
                    className="rounded-full px-3 py-1 hover:bg-white hover:text-zinc-900 dark:hover:bg-zinc-800"
                  >
                    Landing
                  </Link>
                  <Link
                    href="/"
                    className="rounded-full px-3 py-1 hover:bg-white hover:text-zinc-900 dark:hover:bg-zinc-800"
                  >
                    Repositories
                  </Link>
                </nav>
              </div>
              <SignButton />
            </div>
          </header>
          {children}
        </Providers>
      </body>
    </html>
  );
}