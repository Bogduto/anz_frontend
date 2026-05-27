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
  title: "anz — Code Activity Insights",
  description: "Repository statistics with sessions, slices, and activity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <header
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 2rem",
              height: "56px",
              background: "#1C1917",
              borderBottom: "0.5px solid rgba(255,255,255,0.08)",
              position: "sticky",
              top: 0,
              zIndex: 50,
            }}
            aria-label="Main navigation"
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              <Link
                href="/"
                style={{
                  fontSize: "18px",
                  fontWeight: 500,
                  color: "var(--color-text-primary)",
                  letterSpacing: "-0.5px",
                  textDecoration: "none",
                }}
              >
                anz
              </Link>
              <nav
                style={{ display: "flex", gap: "4px" }}
                aria-label="Primary"
              >
                <Link
                  href="/landing"
                  style={{
                    fontSize: "14px",
                    color: "var(--color-text-secondary)",
                    padding: "6px 12px",
                    borderRadius: "var(--border-radius-md)",
                    textDecoration: "none",
                  }}
                >
                  Landing
                </Link>
                <Link
                  href="/"
                  style={{
                    fontSize: "14px",
                    color: "var(--color-text-secondary)",
                    padding: "6px 12px",
                    borderRadius: "var(--border-radius-md)",
                    textDecoration: "none",
                  }}
                >
                  Workspaces
                </Link>
              </nav>
            </div>

            <SignButton />
          </header>

          {children}
        </Providers>
      </body>
    </html>
  );
}
