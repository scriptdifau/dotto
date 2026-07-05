import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { parseEventInput } from "@/lib/event";

// PATCH /api/admin/events/[id] — aggiorna un evento (lo slug resta invariato
// per non rompere QR ed embed già distribuiti).
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Non autorizzato." }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Evento non trovato." }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  const parsed = parseEventInput(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  await prisma.event.update({
    where: { id },
    data: {
      name: parsed.name,
      location: parsed.location,
      startsAt: parsed.startsAt,
      endsAt: parsed.endsAt,
      totalSlots: parsed.totalSlots,
      description: parsed.description,
      active: parsed.active,
    },
  });

  return NextResponse.json({ ok: true });
}

// DELETE /api/admin/events/[id] — elimina un evento senza prenotazioni.
// Se ci sono prenotazioni, va disattivato (non eliminato) per non perdere dati.
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Non autorizzato." }, { status: 401 });
  }

  const { id } = await params;
  const count = await prisma.booking.count({ where: { eventId: id } });
  if (count > 0) {
    return NextResponse.json(
      {
        error: `L'evento ha ${count} prenotazioni. Disattivalo invece di eliminarlo.`,
      },
      { status: 409 }
    );
  }

  await prisma.event.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
