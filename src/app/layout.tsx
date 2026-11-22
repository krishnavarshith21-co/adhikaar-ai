import type { Metadata } from "next";
import { Fraunces, Manrope, Noto_Sans_Devanagari, Noto_Sans_Telugu } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const devanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-devanagari",
  display: "swap",
});

const telugu = Noto_Sans_Telugu({
  subsets: ["telugu"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-telugu",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ADHIKAAR AI — Civic Assistance Platform",
  description:
    "Discover government and NGO schemes, check eligibility, prepare documents, and track applications with ADHIKAAR AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${manrope.variable} ${devanagari.variable} ${telugu.variable}`}
    >
      <body className="font-sans antialiased bg-linen text-sapphire">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
