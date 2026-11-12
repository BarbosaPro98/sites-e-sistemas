import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" });
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Clínica Clive", template: "%s | Clínica Clive" },
  description: "Estética avançada, saúde integrativa e bem-estar. Clínica Clive na Corrida AMB.",
};

export const viewport: Viewport = {
  themeColor: "#1f4a40",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${manrope.variable} ${cormorant.variable} antialiased`}>{children}</body>
    </html>
  );
}
