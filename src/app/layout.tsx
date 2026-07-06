import type { Metadata, Viewport } from "next";
import { baseUrl } from "@/lib/qr";
import "./globals.css";

const title = "Dottò — parcheggio bici custodito per eventi";
const description =
  "Il primo servizio di parcheggio bici custodito per eventi temporanei in Italia. Prenoti il tuo slot, mostri il QR, lasci la bici in sicurezza. Gratis.";
const ogImage = { url: "/og.jpg", width: 1200, height: 630, alt: "Dottò — parcheggio bici gratuito e custodito per eventi" };

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl()),
  title,
  description,
  openGraph: {
    title,
    description:
      "Il primo servizio di parcheggio bici custodito per eventi temporanei in Italia. Gratis, semplice, sicuro.",
    type: "website",
    locale: "it_IT",
    siteName: "Dottò",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description:
      "Il primo servizio di parcheggio bici custodito per eventi temporanei in Italia. Gratis, semplice, sicuro.",
    images: [ogImage],
  },
};

export const viewport: Viewport = {
  themeColor: "#3F7EC0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
