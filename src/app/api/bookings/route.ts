import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { newBookingToken, bookingUrl } from "@/lib/qr";
import { sendBookingEmail } from "@/lib/email";

// Finestra anti doppio-invio/spam: stessa email+evento entro N secondi.
const THROTTLE_SECONDS = 15;

// POST /api/bookings  { eventSlug, name, email, phone?, privacy, azienda? }
export async function POST(req: Request) {
  let body: {
    eventSlug?: string;
    name?: string;
    email?: string;
    phone?: string;
    privacy?: boolean;
    azienda?: string; // honeypot: deve restare vuoto
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  // Honeypot: se è compilato, è un bot. Rispondiamo generico.
  if (body.azienda && body.azienda.trim() !== "") {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  const { eventSlug, name, email, phone } = body;

  if (!eventSlug || !name?.trim() || !email?.trim()) {
    return NextResponse.json(
      { error: "Nome, email ed evento sono obbligatori." },
      { status: 400 }
    );
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    return NextResponse.json({ error: "Email non valida." }, { status: 400 });
  }

  // Consenso privacy obbligatorio (GDPR).
  if (body.privacy !== true) {
    return NextResponse.json(
      { error: "Devi accettare l'informativa privacy per prenotare." },
      { status: 400 }
    );
  }

  const event = await prisma.event.findUnique({ where: { slug: eventSlug } });
  if (!event || !event.active) {
    return NextResponse.json({ error: "Evento non disponibile." }, { status: 404 });
  }

  // Throttle: evita doppi invii ravvicinati per la stessa email/evento.
  const recent = await prisma.booking.count({
    where: {
      eventId: event.id,
      email: email.trim().toLowerCase(),
      createdAt: { gt: new Date(Date.now() - THROTTLE_SECONDS * 1000) },
    },
  });
  if (recent > 0) {
    return NextResponse.json(
      { error: "Hai appena inviato una richiesta. Attendi qualche secondo." },
      { status: 429 }
    );
  }

  // Calcola capienza e assegna il numero di slot in modo atomico.
  try {
    const booking = await prisma.$transaction(async (tx) => {
      const active = await tx.booking.count({
        where: { eventId: event.id, status: { in: ["BOOKED", "CHECKED_IN"] } },
      });
      if (active >= event.totalSlots) {
        throw new Error("SOLD_OUT");
      }
      return tx.booking.create({
        data: {
          eventId: event.id,
          token: newBookingToken(),
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone?.trim() || null,
          slotNumber: active + 1,
          status: "BOOKED",
        },
      });
    });

    // Email di conferma (best-effort: non blocca la prenotazione se fallisce).
    await sendBookingEmail(
      { token: booking.token, name: booking.name, email: booking.email, slotNumber: booking.slotNumber },
      { name: event.name, location: event.location, startsAt: event.startsAt }
    );

    return NextResponse.json({
      token: booking.token,
      slotNumber: booking.slotNumber,
      eventName: event.name,
      bookingUrl: bookingUrl(booking.token),
    });
  } catch (err) {
    if (err instanceof Error && err.message === "SOLD_OUT") {
      return NextResponse.json({ error: "Posti esauriti per questo evento." }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: "Errore nel salvataggio." }, { status: 500 });
  }
}
