import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const preferredRegion = "fra1";

// Mesi di conservazione dei dati personali dopo l'evento.
const RETENTION_MONTHS = 12;

// GET /api/cron/cleanup
// Anonimizza i dati personali delle prenotazioni di eventi conclusi da oltre
// RETENTION_MONTHS. Mantiene la riga (per le statistiche) ma rimuove nome,
// email e telefono. Pensato per essere eseguito da Vercel Cron una volta al
// giorno; protetto da CRON_SECRET.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Non autorizzato." }, { status: 401 });
    }
  } else {
    console.warn("[cleanup] CRON_SECRET non impostato: endpoint non protetto.");
  }

  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - RETENTION_MONTHS);

  // Eventi conclusi da oltre la soglia di conservazione.
  const oldEvents = await prisma.event.findMany({
    where: { startsAt: { lt: cutoff } },
    select: { id: true },
  });
  const ids = oldEvents.map((e) => e.id);
  if (ids.length === 0) {
    return NextResponse.json({ anonymized: 0, cutoff: cutoff.toISOString() });
  }

  const result = await prisma.booking.updateMany({
    where: { eventId: { in: ids }, anonymizedAt: null },
    data: {
      name: "Anonimizzato",
      email: "",
      phone: null,
      anonymizedAt: new Date(),
    },
  });

  console.info(`[cleanup] anonimizzate ${result.count} prenotazioni (cutoff ${cutoff.toISOString()}).`);
  return NextResponse.json({ anonymized: result.count, cutoff: cutoff.toISOString() });
}
