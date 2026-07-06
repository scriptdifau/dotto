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

// URL pubblico di base del sito.
// Priorità: variabile esplicita → dominio di produzione fornito da Vercel → locale.
// Così in produzione i QR puntano al dominio giusto anche senza configurazione.
export function baseUrl(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}

// URL che il parcheggiatore apre / scansiona per una prenotazione.
export function bookingUrl(token: string): string {
  return `${baseUrl()}/booking/${token}`;
}
