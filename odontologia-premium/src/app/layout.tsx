import type { Metadata, Viewport } from "next";
import { Allura, Manrope, Playfair_Display } from "next/font/google";
import { site } from "@/config/site";
import { seoDescription, seoKeywords, seoTitle } from "@/lib/seo";
import "./globals.css";

// Playfair Display: Cormorant renders Portuguese circumflexes detached in Chrome.
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" });
const allura = Allura({ variable: "--font-allura", subsets: ["latin"], weight: "400", display: "swap" });

export const metadata: Metadata = {
  title: seoTitle(),
  description: seoDescription(),
  keywords: seoKeywords(),
  ...(site.seo.siteUrl
    ? { metadataBase: new URL(site.seo.siteUrl), alternates: { canonical: "/" } }
    : {}),
  openGraph: {
    title: seoTitle(),
    description: seoDescription(),
    type: "website",
    locale: "pt_BR",
    ...(site.professional.photo ? { images: [site.professional.photo] } : {}),
  },
  // Preview builds must not be indexed.
  robots: site.previewMode ? { index: false, follow: false } : { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#32111c",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${manrope.variable} ${allura.variable}`}>
      <body>{children}</body>
    </html>
  );
}
