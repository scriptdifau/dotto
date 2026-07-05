import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dottò — parcheggio bici custodito per eventi",
  description:
    "Il primo servizio di parcheggio bici custodito per eventi temporanei in Italia. Prenoti il tuo slot, mostri il QR, lasci la bici in sicurezza. Gratis.",
  openGraph: {
    title: "Dottò — parcheggio bici custodito per eventi",
    description:
      "Il primo servizio di parcheggio bici custodito per eventi temporanei in Italia. Gratis, semplice, sicuro.",
    type: "website",
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
