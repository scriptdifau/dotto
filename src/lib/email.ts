import { Resend } from "resend";
import QRCode from "qrcode";
import { bookingUrl } from "./qr";

// Invio email di conferma prenotazione.
//
// È tollerante ai guasti: se RESEND_API_KEY non è configurata (es. in locale)
// la funzione non fa nulla e non blocca la prenotazione. Un eventuale errore
// di invio viene loggato ma NON propagato: l'utente ha comunque la conferma a
// schermo e la pagina del QR.

type BookingLike = {
  token: string;
  name: string;
  email: string;
  slotNumber: number | null;
};

type EventLike = {
  name: string;
  location: string;
  startsAt: Date;
};

export async function sendBookingEmail(booking: BookingLike, event: EventLike): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) {
    console.info("[email] RESEND_API_KEY/EMAIL_FROM non configurati: email saltata.");
    return;
  }

  try {
    const resend = new Resend(apiKey);
    const url = bookingUrl(booking.token);
    const qrPng = await QRCode.toBuffer(url, {
      errorCorrectionLevel: "M",
      margin: 2,
      width: 320,
      color: { dark: "#17255A", light: "#FFFFFF" },
    });
    const date = event.startsAt.toLocaleString("it-IT", {
      dateStyle: "long",
      timeStyle: "short",
    });

    await resend.emails.send({
      from,
      to: booking.email,
      subject: `La tua prenotazione Dottò — ${event.name}`,
      html: emailHtml({ name: booking.name, event, date, url, slot: booking.slotNumber }),
      attachments: [{ filename: "qr-dotto.png", content: qrPng }],
    });
  } catch (err) {
    console.error("[email] invio fallito:", err);
  }
}

function emailHtml({
  name,
  event,
  date,
  url,
  slot,
}: {
  name: string;
  event: EventLike;
  date: string;
  url: string;
  slot: number | null;
}): string {
  return `<!doctype html>
<html lang="it"><body style="margin:0;background:#F1F6FC;font-family:Arial,Helvetica,sans-serif;color:#17255A">
  <div style="max-width:480px;margin:0 auto;padding:24px">
    <div style="text-align:center;padding:8px 0 16px">
      <span style="font-size:22px;font-weight:800;color:#3F7EC0">Dottò</span>
    </div>
    <div style="background:#fff;border-radius:20px;padding:24px;text-align:center">
      <div style="display:inline-block;background:rgba(63,126,192,.15);color:#2C5E97;font-size:12px;font-weight:700;padding:6px 12px;border-radius:999px">
        Prenotazione confermata
      </div>
      <h1 style="font-size:22px;margin:16px 0 4px">Ciao ${escapeHtml(name)}!</h1>
      <p style="margin:0;color:#5b6b8c">
        Il tuo posto bici è prenotato${slot ? ` · slot #${slot}` : ""}.
      </p>
      <div style="margin:20px 0;padding:16px;background:#F1F6FC;border-radius:16px;text-align:left">
        <div style="font-weight:700;font-size:16px">${escapeHtml(event.name)}</div>
        <div style="color:#5b6b8c">${escapeHtml(event.location)}</div>
        <div style="color:#5b6b8c">${escapeHtml(date)}</div>
      </div>
      <a href="${url}" style="display:inline-block;background:#3F7EC0;color:#fff;text-decoration:none;font-weight:700;padding:14px 24px;border-radius:999px">
        Apri il mio QR code
      </a>
      <p style="margin:16px 0 0;color:#8a97b3;font-size:13px">
        Mostra il QR al parcheggiatore all'arrivo e, con lo stesso QR, riprendi la bici al ritorno.
        Trovi il QR anche in allegato a questa email.
      </p>
    </div>
    <p style="text-align:center;color:#8a97b3;font-size:12px;margin-top:16px">
      Dottò · parcheggio bici gratuito e custodito per eventi
    </p>
  </div>
</body></html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
