import QRCode from "qrcode";
import { randomBytes } from "crypto";

// Genera un token univoco per una prenotazione (usato dentro al QR).
export function newBookingToken(): string {
  return randomBytes(9).toString("base64url");
}

// Restituisce il QR come data URL PNG, pronto per un <img src>.
export async function qrDataUrl(text: string): Promise<string> {
  return QRCode.toDataURL(text, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 320,
    color: { dark: "#17255A", light: "#FFFFFF" },
  });
}

// URL che il parcheggiatore apre / scansiona per una prenotazione.
export function bookingUrl(token: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  return `${base}/booking/${token}`;
}
