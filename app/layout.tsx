import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/layout/footer";
import { site } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Orbit Eight — Explore Beyond the Known",
    template: "%s",
  },
  description:
    "Orbit Eight is a space enthusiast community for those who never stopped looking up. Astronomy, astrophotography, discoveries, and the universe beyond.",
  openGraph: {
    siteName: "Orbit Eight",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      {/* Grammarly and similar extensions inject attributes into <body>
          before React hydrates; suppress the false-positive mismatch. */}
      <body
        className="min-h-screen bg-void font-body text-secondary antialiased"
        suppressHydrationWarning
      >
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
